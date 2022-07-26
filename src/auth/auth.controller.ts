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
  async signUp(@Body() userRegisterDto: UserRegisterDTO): Promise<User> {
    return await this.authService.registerUser(userRegisterDto);
  }

  //로컬 환경 로그인 (테스트용)
  @Post('local')
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiCreatedResponse({ description: 'JWT 토큰', type: Tokens })
  async logIn(
    //데코레이터 Body와 express의 Res를 같이 사용하기 위해 passthrough : true
    @Body() userRegisterDTO: UserRegisterDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    //로그인 처리, jwt 발급 (AccessToken, RefreshToken)
    const {tokens, user} = await this.authService.verifyUserAndSignJWT(userRegisterDTO);

    response.cookie('jwt-access', tokens.accessToken, { httpOnly: true });
    response.cookie('jwt-refresh', tokens.refreshToken, { httpOnly: true });
  }

  //리프레시 토큰 재발급
  //   @UseGuards(RefreshTokenGuard)
  @Post('local/refresh')
  @ApiOperation({ summary: '리프레시 토큰 재발급' })
  @ApiCreatedResponse({ description: 'JWT 토큰', type: Tokens })
  async refreshToken(
    @Body('email') email: string,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshToken = req.cookies['jwt-refresh'];
    const tokens = await this.authService.refreshTokens(email, refreshToken);
    response.cookie('jwt-access', tokens.accessToken, { httpOnly: true });
    response.cookie('jwt-refresh', tokens.refreshToken, { httpOnly: true });
    return;
  }



  @Get('/github')
  async logInWithGithub(
    @Query() socialCodeDto: SocialCodeDto,
    @Res({ passthrough: true }) response: Response,
  ) : Promise<User>{ //
    const {user, tokens} = await this.githubAuthService.getGithubInfo(socialCodeDto);
	response.cookie('jwt-access', tokens.accessToken, { httpOnly: true });
    response.cookie('jwt-refresh', tokens.refreshToken, { httpOnly: true });
    return user;
  }

  @Get('/google')
  async loginWithGoogle(
	@Query() socialCodeDto: SocialCodeDto,
    @Res({ passthrough: true }) response: Response,
  ) : Promise<User>{ //
    const {user, tokens} = await this.googleAuthService.getGoogleInfo(socialCodeDto);
	response.cookie('jwt-access', tokens.accessToken, { httpOnly: true });
    response.cookie('jwt-refresh', tokens.refreshToken, { httpOnly: true });
    return user;
  }


    //로그아웃 (DB의 refreshToken 삭제)
	@UseGuards(AccessTokenGuard)
	@ApiOperation({ summary: '로그아웃 처리 (DB의 refreshToken 삭제' })
	@Delete('logout')
	async logout(
		@CurrentUser('email') email: string,
		@Res() response: Response
		) {
			await this.authService.deleteRefreshToken(email)
			// response.clearCookie("jwt-access")
			// response.clearCookie("jwt-refresh")
			response.send({successs:true})
	}
}

