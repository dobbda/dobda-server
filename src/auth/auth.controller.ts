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
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubUserDto } from './dtos/social-user.dto';
import { SocialCodeDto } from './dtos/social-code.dto';
import { GoogleAuthService } from './social/google.auth.service';
import { GithubAuthService } from './social/github.auth.service';
import { KakaoAuthService } from './social/kakao.auth.service';
import { NaverAuthService } from './social/naver.auth.service';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly githubAuthService: GithubAuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly naverAuthService: NaverAuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}
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

  @Get('/github')
  async logInWithGithub(@Query() socialCodeDto: SocialCodeDto) {
    const user = await this.githubAuthService.getGithubInfo(socialCodeDto);

    return user;
  }

  @Get('/google')
  async loginWithGoogle(@Query() socialCodeDto: SocialCodeDto) {
    console.log("code: ",socialCodeDto)
    const user = await this.googleAuthService.getGoogleInfo(socialCodeDto);

    return user;
  }
}
