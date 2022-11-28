import { UsersRepository } from '../../users/repositories/users.repository';
import { JwtPayload } from './types/jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { jwtExtractorFromCookies } from './jwtExtractorFromCookies';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

// guard -> strategy -> validate
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      //개발자 환경에서는 jwt를 헤더에서 추출하고 실제 배포 환경에서는 쿠키에서 추출
      jwtFromRequest:
        process.env.NODE_ENV === 'dev'
          ? ExtractJwt.fromAuthHeaderAsBearerToken()
          : ExtractJwt.fromExtractors([jwtExtractorFromCookies]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    try {
      //토큰을 req에서 추출
      //   const refreshToken = req.get('authorization').replace('Bearer ', '');

      // cookie에서 refreshToken 추출
      const refreshToken = req.cookies['jwt-refresh'];
      //전달받은 유저가 존재하는지 확인

      const user = await this.usersRepository.findUserByEmail(payload.email);
      if (user) {
        //리프레시 토큰을 붙여서 리턴
        user.refreshToken = refreshToken;
        return user;
      } else {
        throw new Error(
          '인증이 만료 되었거나, 잘못된 접근입니다. 로그인후 재시도 바랍니다',
        );
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
