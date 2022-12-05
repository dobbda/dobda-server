import { UserRegisterDTO } from './../../users/dtos/user-register.dto';
import { AuthService } from '../auth.service';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { SocialCodeDto } from '../dtos/social-code.dto';

@Injectable()
export class GoogleAuthService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) {}

  async getGoogleInfo(socialCodeDto: SocialCodeDto): Promise<any> {
    const prod = process.env.NODE_ENV == 'prod';
    const redirectUri = prod
      ? `${this.configService.get<string>('PROD_REDIR_URL')}/google`
      : `${this.configService.get<string>('DEV_REDIR_URL')}/google`;
    try {
      const getTokenUrl: string = 'https://oauth2.googleapis.com/token'; //
      const getUserUrl: string =
        'https://www.googleapis.com/oauth2/v3/userinfo?access_token'; //

      const request = {
        code: socialCodeDto.code,
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        grant_type: 'authorization_code',
        redirectUri: redirectUri,
      };

      const response: AxiosResponse = await axios.post(getTokenUrl, request, {
        headers: {
          accept: 'application/json', // json으로 반환을 요청합니다.
        },
      });
      const { access_token } = response.data;

      const { data } = await axios.get(`${getUserUrl}=${access_token}`);

      const { name, picture, email } = data;
      const googleInfo: UserRegisterDTO = {
        name: name || 'user_' + Math.floor(Math.random() * 10000), //실명은 웹내에서 추가로 인증예정
        nickname: name || 'user_' + Math.floor(Math.random() * 10000),
        email,
        avatar: `https://avatars.dicebear.com/api/adventurer-neutral/${name}.svg`,
        sign: 'google',
      };
      return this.authService.verifyUserAndSignJWT(googleInfo);
    } catch (err) {
      throw new HttpException('Google 인증실패.', 401);
    }
  }
}
