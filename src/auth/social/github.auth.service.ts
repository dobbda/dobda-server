import { SocialCodeDto } from './../dtos/social-code.dto';
import { AuthService } from '../auth.service';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import { UsersRepository } from 'src/users/users.repository';
import { ResLoginUser } from '../dtos/response-login-user';
import { UserRegisterDTO } from 'src/users/dtos/user-register.dto';

@Injectable()
export class GithubAuthService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) {}

  async getGithubInfo(socialCodeDto: SocialCodeDto): Promise<ResLoginUser> {
    const prod = process.env.NODE_ENV == 'prod';
    const redirectUri = prod
      ? `${this.configService.get<string>('PROD_REDIR_URL')}/google`
      : `${this.configService.get<string>('DEV_REDIR_URL')}/google`;
    try {
      const getTokenUrl: string = 'https://github.com/login/oauth/access_token'; // 깃허브 access token을 얻기위한 요청 API 주소
      const getUserUrl: string = 'https://api.github.com/user'; // 깃허브 유저 조회 API 주소
      const getUserMail: string = 'https://api.github.com/user/emails';

      const request = {
        code: socialCodeDto.code,
        client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
        client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
      };

      const response: AxiosResponse = await axios.post(getTokenUrl, request, {
        headers: {
          accept: 'application/json', // json으로 반환을 요청합니다.
        },
      });
      const { access_token } = response.data;
      const { data } = await axios.get(getUserUrl, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      // 메일
      const { data: emailDataArr } = await axios.get(getUserMail, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
      const { email } = await emailDataArr.find(
        (emailObj) => emailObj.primary === true && emailObj.verified === true,
      );

      const { avatar_url, name, bio } = data;
      const githubInfo: UserRegisterDTO = {
        avatar: `https://avatars.dicebear.com/api/adventurer-neutral/${name}.svg`,
        name,
        nickname: name,
        description: bio,
        email,
      };

      return this.authService.verifyUserAndSignJWT(githubInfo);
    } catch (err) {
      console.log(err);
      throw new HttpException('Github 인증을 실패', 401);
    }
  }
}
