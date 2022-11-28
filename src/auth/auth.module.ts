import { RefreshTokenStrategy } from './jwt/refresh-token.strategy';
import { AccessTokenStrategy } from './jwt/access-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersModule } from './../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubAuthService } from './social/github.auth.service';
import { KakaoAuthService } from './social/kakao.auth.service';
import { NaverAuthService } from './social/naver.auth.service';
import { GoogleAuthService } from './social/google.auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    JwtModule.register({}),

    forwardRef(() => UsersModule), //양쪽에서 순환참조를 하기 때문
  ],
  providers: [
    AuthService,
    GithubAuthService,
    GoogleAuthService,
    KakaoAuthService,
    NaverAuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
