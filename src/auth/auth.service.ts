import { UserRegisterDTO } from './../users/dtos/user-register.dto';
import { Tokens } from './jwt/jwt.token';
import { UserLogInDTO } from './../users/dtos/user-login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from './../users/users.repository';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //로컬 회원가입
  async registerUser(userRegisterDto: UserRegisterDTO) {
    return await this.usersRepository.createUser(userRegisterDto);
  }

  //DB에 유저가 존재하는지 확인 후 JWT(AccessToken)를 발급 (로그인 로직)
  async verifyUserAndSignJWT(email: UserLogInDTO['email']): Promise<Tokens> {
    const user = await this.usersRepository.findUserByEmail(email);

    try {
      const tokens = await this.createJWT(user.email);
      await this.updateRefreshToken(user.email, tokens.refreshToken);

      return tokens;
    } catch (error) {
      Logger.log(error, 'AuthService');
      throw new BadRequestException(error.message);
    }
  }

  //RefreshToken 해쉬 생각해보기

  async createJWT(email: UserLogInDTO['email']): Promise<Tokens> {
    //두 토큰 발급
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(email: UserLogInDTO['email'], refreshToken: string) {
    await this.usersRepository.update({ email }, { refreshToken });
  }

  async deleteRefreshToken(email: UserLogInDTO['email']) {
    await this.usersRepository.update({ email }, { refreshToken: null });
  }

  /* 깃헙 로그인 관련 부분 : 뷰에게서 코드를 받아와서 테스트 해보지 않았기 때문에 프론트랑 연결할때 새로 개발 예정
  async getGithubInfo(githubCodeDto: GithubCodeDto): Promise<GithubUserDto> {
    const { code } = githubCodeDto;
    // 웹에서 query string으로 받은 code를 서버로 넘겨 받습니다.

    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';
    // 깃허브 access token을 얻기위한 요청 API 주소

    const request = {
      code,
      client_id: this.configService.get<string>('GITHUB_CLIENT_ID'),
      client_secret: this.configService.get<string>('GITHUB_CLIENT_SECRET'),
    };
    // Body에는 Client ID, Client Secret, 웹에서 query string으로 받은 code를 넣어서 전달해주어야 합니다.

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json', // json으로 반환을 요청합니다.
      },
    });

    if (response.data.error) {
      // 에러 발생시
      throw new HttpException('깃허브 인증을 실패했습니다.', 401);
    }

    const { access_token } = response.data;
    // 요청이 성공한다면, access_token 키값의 토큰을 깃허브에서 넘겨줍니다.

    const getUserUrl: string = 'https://api.github.com/user';
    // 깃허브 유저 조회 API 주소

    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
      // 헤더에는 `token ${access_token} 형식으로 넣어주어야 합니다.`
    });

    const { login, avatar_url, name, bio, company } = data;
    // 깃허브 유저 조회 API에서 받은 데이터들을 골라서 처리해줍니다.

    const githubInfo: GithubUserDto = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company,
    };

    return githubInfo;
  } */
}
