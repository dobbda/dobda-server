import { User } from './entities/user.entity';
import { UserLogInDTO } from './dtos/user-login.dto';
import { ConfigService } from '@nestjs/config';
import { UserRegisterDTO } from './dtos/user-register.dto';
import { UsersRepository } from './users.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(userRegisterDto: UserRegisterDTO) {
    return await this.usersRepository.createUser(userRegisterDto);
  }

  async verifyUserAndSignJwt(
    email: UserLogInDTO['email'],
  ): Promise<{ jwt: string; user: User }> {
    const user = await this.usersRepository.findUserByEmail(email);

    try {
      //jwt 생성 후 전달
      const jwt = await this.jwtService.signAsync(
        { email: user.email },
        { secret: this.configService.get('SECRET_KEY') },
      );
      return { jwt, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  logIn(body): string {
    return 'log in';
  }

  list() {
    return this.usersRepository.list();
  }

  async findUser(email: string) {
    return await this.usersRepository.findUserByEmail(email);
  }
}
