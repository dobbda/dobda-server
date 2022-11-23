import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import { UserRegisterDTO } from 'src/users/dtos/user-register.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { AuthService } from '../auth.service';
import { SocialCodeDto } from '../dtos/social-code.dto';

@Injectable()
export class NaverAuthService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) {}

  async getNaverInfo(socialCodeDto: SocialCodeDto) {
    const prod = process.env.NODE_ENV == 'prod';
    const redirectUri = prod
      ? `${this.configService.get<string>('PROD_REDIR_URL')}/naver`
      : `${this.configService.get<string>('DEV_REDIR_URL')}/naver`;

    try {
      const getTokenUrl: string = 'https://nid.naver.com/oauth2.0/token'; //
      const getUserUrl: string = 'https://openapi.naver.com/v1/nid/me'; //

      const grant_type = 'authorization_code';
      const client_id = this.configService.get<string>('NAVER_CLIENT_ID');
      const client_secret = this.configService.get<string>(
        'NAVER_CLIENT_SECRET',
      );
      const code = socialCodeDto.code;
      const state = '9kgsGTfH4j7IyAkg';

      const api_url =
        'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' +
        client_id +
        '&client_secret=' +
        client_secret +
        '&redirect_uri=' +
        redirectUri +
        '&code=' +
        code +
        '&state=' +
        state;

      const response: AxiosResponse = await axios.post(api_url, {
        headers: {
          accept: 'application/json', // json으로 반환을 요청합니다.
        },
      });
      const { access_token } = response.data;

      const { data } = await axios.get(getUserUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { name, profile_image, email, nickname } = data.response;
      const naver: UserRegisterDTO = {
        name, //실명은 웹내에서 추가로 인증예정
        nickname: nickname || name,
        email: email,
        avatar:
          profile_image ||
          `https://avatars.dicebear.com/api/adventurer-neutral/${
            nickname || name
          }.svg`,
        sign: 'naver',
      };
      return this.authService.verifyUserAndSignJWT(naver);
    } catch (err) {
      console.log(err);
      throw new HttpException('Google 인증실패.', 401);
    }
  }
}
