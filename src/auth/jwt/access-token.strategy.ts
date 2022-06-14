import { UsersRepository } from '../../users/users.repository';
import { JwtPayload } from './types/jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { jwtExtractorFromCookies } from '../../common/utils/jwtExtractorFromCookies';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

// guard -> strategy -> validate
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
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
      const accessToken = req.get('authorization').replace('Bearer ', '');

      const user = await this.usersRepository.findUserByEmail(payload.email);
      if (user) {
        return { user, accessToken };
      } else {
        throw new Error('해당하는 유저는 없습니다.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
