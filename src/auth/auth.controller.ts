import { ResLoginUser } from './dtos/response-login-user';
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
import { SocialCodeDto } from './dtos/social-code.dto';
import { GoogleAuthService } from './social/google.auth.service';
import { GithubAuthService } from './social/github.auth.service';
import { KakaoAuthService } from './social/kakao.auth.service';
import { NaverAuthService } from './social/naver.auth.service';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly githubAuthService: GithubAuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly naverAuthService: NaverAuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  //로그인 되어있는 유저 정보 조회
  @Get()
  @ApiOperation({ summary: '<auth>현재 로그인 되어 있는 유저 정보 조회' })
  @ApiCreatedResponse({ description: '유저 정보', type: User })
  @UseGuards(AccessTokenGuard)
  async getCurrentUser(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }

  //로컬 회원가입
  @Post('local/new')
  @ApiOperation({ summary: '로컬 회원가입' })
  async signUp(@Body() userRegisterDto: UserRegisterDTO): Promise<User> {
    return await this.authService.registerUser(userRegisterDto);
  }

  //로컬 환경 로그인 (테스트용) postman ///////////////
  @Post('local')
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiCreatedResponse({ description: 'JWT 토큰', type: Tokens })
  async logIn(
    //데코레이터 Body와 express의 Res를 같이 사용하기 위해 passthrough : true
    @Body() userRegisterDTO: UserRegisterDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    //로그인 처리, jwt 발급 (AccessToken, RefreshToken)
    const { tokens, user } = await this.authService.verifyUserAndSignJWT(
      userRegisterDTO,
    );

    response.cookie('jwt-access', tokens.accessToken, { httpOnly: true });
    response.cookie('jwt-refresh', tokens.refreshToken, { httpOnly: true });
  }

  //리프레시 토큰 재발급
  @Get('refresh')
  @ApiOperation({ summary: '리프레시 토큰 재발급' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResLoginUser> {
    const accessExpires = new Date(Date.now() + 1000 * 60 * 60); //1시간//
    const refreshExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7일
    const resRefreshData = await this.authService.refreshTokens(
      req.cookies['jwt-refresh'],
    );

    response.cookie('jwt-access', resRefreshData.tokens.accessToken, {
      expires: accessExpires,
      httpOnly: true,
    });
    response.cookie('jwt-refresh', resRefreshData.tokens.refreshToken, {
      expires: refreshExpires,
      httpOnly: true,
      // signed:true    //쿠키보안 적용시 postman에서  해석못함
    });

    response.cookie('refresh-expires', refreshExpires, {
      httpOnly: false,
      expires: refreshExpires,
    });
    response.cookie('access-expires', refreshExpires, {
      expires: accessExpires,
      httpOnly: false,
    });
    return resRefreshData;
  }

  ///////////////////  로그아웃 (DB의 refreshToken 삭제) //////////////////////////////
  @Delete('logout')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '로그아웃 처리 (DB의 refreshToken 삭제' })
  async logout(@CurrentUser('email') email: string, @Res() response: Response) {
    await this.authService.deleteRefreshToken(email);
    response.clearCookie('jwt-access');
    response.clearCookie('jwt-refresh');
    response.clearCookie('access-expires');
    response.clearCookie('refresh-expires');
    response.send();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //  	                                     소셜로그인                                             //
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  @Get('/:social')
  async logInWithGithub(
    @Query() socialCodeDto: SocialCodeDto,
    @Res({ passthrough: true }) response: Response,
    @Param('social') social: string,
  ): Promise<User> {
    const accessExpires = new Date(Date.now() + 1000 * 60 * 1); //
    const refreshExpires = new Date(Date.now() + 1000 * 60 * 600); // 24 hour 7일
    const { user, tokens } =
      (social == 'google' &&
        (await this.googleAuthService.getGoogleInfo(socialCodeDto))) ||
      (social == 'github' &&
        (await this.githubAuthService.getGithubInfo(socialCodeDto)));
    response.cookie('jwt-access', tokens.accessToken, {
      expires: accessExpires,
      httpOnly: true,
      // signed: true
    });
    response.cookie('jwt-refresh', tokens.refreshToken, {
      expires: refreshExpires,
      httpOnly: true,
      // signed:true
    });

    response.cookie('refresh-expires', refreshExpires, {
      httpOnly: false,
      expires: refreshExpires,
    });
    response.cookie('access-expires', refreshExpires, {
      expires: accessExpires,
      httpOnly: false,
    });
    return user;
  }
}
