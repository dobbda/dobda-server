import { Tokens } from './jwt/types/jwt.token';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { UserLogInDTO } from './../users/dtos/user-login.dto';
import { AuthService } from './auth.service';
import { UserRegisterDTO } from './../users/dtos/user-register.dto';
import {
  Body,
  Controller,
  Delete,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //로컬 회원가입
  @Post('local/new')
  @ApiOperation({ summary: '로컬 회원가입' })
  async signUp(@Body() userRegisterDto: UserRegisterDTO): Promise<void> {
    return await this.authService.registerUser(userRegisterDto);
  }

  //로컬 환경 로그인 (테스트용)
  @Post('local')
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiCreatedResponse({ description: 'JWT 토큰', type: Tokens })
  async logIn(
    //데코레이터 Body와 express의 Res를 같이 사용하기 위해 passthrough : true
    @Body() userLoginDTO: UserLogInDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Tokens> {
    //로그인 처리, jwt 발급 (AccessToken, RefreshToken)
    const tokens = await this.authService.verifyUserAndSignJWT(
      userLoginDTO.email,
    );

    response.cookie('jwt', tokens.accessToken, { httpOnly: true });

    return tokens;
  }

  //리프레시 토큰 재발급
  @UseGuards(RefreshTokenGuard)
  @Post('local/refresh')
  @ApiOperation({ summary: '리프레시 토큰 재발급' })
  @ApiCreatedResponse({ description: 'JWT 토큰', type: Tokens })
  async refreshToken(
    @CurrentUser('email') email: string,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshTokens(email, refreshToken);
  }

  //로그아웃 (DB의 refreshToken 삭제)
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '로그아웃 처리 (DB의 refreshToken 삭제' })
  @Delete('local')
  async logout(@CurrentUser('email') email: string) {
    return await this.authService.deleteRefreshToken(email);
  }

  /* 깃헙 로그인 관련 부분 : 뷰에게서 코드를 받아와서 테스트 해보지 않았기 때문에 프론트랑 연결할때 새로 개발 예정
    @Post('github-info')
  async logInWithGithub(
    @Body() githubCodeDto: GithubCodeDto,
  ): Promise<GithubUserDto> {
    const user = await this.usersService.getGithubInfo(githubCodeDto);

    return user;
  } */
}
