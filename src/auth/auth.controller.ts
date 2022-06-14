import { UserLogInDTO } from './../users/dtos/user-login.dto';
import { AuthService } from './auth.service';
import { UserRegisterDTO } from './../users/dtos/user-register.dto';
import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //회원가입
  @Post('local/new')
  async signUp(@Body() userRegisterDto: UserRegisterDTO): Promise<void> {
    return await this.authService.registerUser(userRegisterDto);
  }

  //로컬 환경 로그인 (테스트용)
  @Post('local')
  async logIn(
    //데코레이터 Body와 express의 Res를 같이 사용하기 위해 passthrough : true
    @Body() userLoginDTO: UserLogInDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    //로그인 처리, jwt 발급 (AccessToken, RefreshToken)
    const tokens = await this.authService.verifyUserAndSignJWT(
      userLoginDTO.email,
    );

    response.cookie('jwt', tokens, { httpOnly: true });

    return tokens;
  }

  @Delete('local')
  async logout(@Body() userLogInDTO: UserLogInDTO) {
    return await this.authService.deleteRefreshToken(userLogInDTO.email);
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
