import { User } from 'src/users/entities/user.entity';
import { UserRegisterDTO } from './../users/dtos/user-register.dto';
import { Tokens } from './jwt/types/jwt.token';
import { UserLogInDTO } from './../users/dtos/user-login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './../users/users.repository';
import {
  Injectable,
  BadRequestException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResLoginUser } from './dtos/response-login-user';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //로컬 회원가입
  async registerUser(userRegisterDto: UserRegisterDTO) {
    return await this.usersRepository.createUser(userRegisterDto);
  }

  //DB에 유저가 존재하는지 확인 후 JWT(AccessToken)를 발급 (로그인 로직)
  async verifyUserAndSignJWT(
    userRegisterDTO: UserRegisterDTO,
  ): Promise<ResLoginUser> {
    const user =
      (await this.usersRepository.findUserByEmail(userRegisterDTO.email)) ||
      (await this.registerUser(userRegisterDTO));
    if (!user) {
      throw new Error(`DB Error `);
    }
    try {
      const tokens = await this.createJWT(user.email);
      await this.updateRefreshToken(user.email, tokens.refreshToken);

      return { user, tokens };
    } catch (error) {
      Logger.log(error, 'AuthService');
      throw new BadRequestException(error.message);
    }
  }

  //RefreshToken 해쉬 생각해보기

  async createJWT(email: UserLogInDTO['email']): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: Number(this.configService.get<string>('ACCESS_EXPIRES')),
        },
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
          expiresIn: Number(this.configService.get<string>('REFRESH_EXPIRES')),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  //DB에 RefreshToken을 업데이트
  async updateRefreshToken(email: UserLogInDTO['email'], refreshToken: string) {
    await this.usersRepository.update({ email }, { refreshToken });
  }

  //유저 정보와 DB의 refreshToken을 비교해 유효한 토큰이라면 토큰 재발급
  async refreshTokens(refreshToken: string): Promise<ResLoginUser> {
    const { refreshToken: del, ...user } = await this.usersRepository.findOne({
      refreshToken: refreshToken,
    });
    if (!user) {
      throw new HttpException('유효하지 않은 토큰입니다.', 401);
    }

    const tokens = await this.createJWT(user.email);
    await this.updateRefreshToken(user.email, tokens.refreshToken);

    return { tokens, user };
  }

  async deleteRefreshToken(email: UserLogInDTO['email']) {
    await this.usersRepository.update({ email }, { refreshToken: null });
  }
}
