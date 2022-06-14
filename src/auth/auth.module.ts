import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './../users/users.repository';
import { UsersModule } from './../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      /* secret: process.env.SECRET_KEY,
      secretOrPrivateKey: process.env.SECRET_KEY, //빼고 작동되면 없애기
      signOptions: { expiresIn: '2h' }, */
    }),

    forwardRef(() => UsersModule), //양쪽에서 순환참조를 하기 때문
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
