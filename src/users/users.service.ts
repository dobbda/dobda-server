import { UserRegisterDTO } from './dtos/user-register.dto';
import { UserRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async registerUser(userRegisterDto: UserRegisterDTO) {
    return await this.userRepository.createUser(userRegisterDto);
  }

  logIn(body): string {
    return 'log in';
  }

  list() {
    return this.userRepository.list();
  }
}
