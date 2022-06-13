import { User } from './entities/user.entity';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { UserLogInDTO } from './dtos/user-login.dto';
import { UserRegisterDTO } from './dtos/user-register.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseFilters,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  async list() {
    return this.usersService.list();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post()
  async signUp(@Body() userRegisterDto: UserRegisterDTO): Promise<void> {
    return await this.usersService.registerUser(userRegisterDto);
  }

  @Post('login')
  async logIn(
    //데코레이터 Body와 express의 Res를 같이 사용하기 위해 passthrough : true
    @Body() userLoginDTO: UserLogInDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    //로그인 처리, jwt 발급
    const { jwt, user } = await this.usersService.verifyUserAndSignJwt(
      userLoginDTO.email,
    );

    response.cookie('jwt', jwt, { httpOnly: true });

    //개발자 환경에서는 쿠키에 저장할 수 없으므로 jwt 토큰 정보를 리턴.
    return process.env.NODE_ENV === 'dev' ? jwt : user;
  }
}
