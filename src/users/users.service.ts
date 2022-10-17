import { UserUpdateDTO } from './dtos/user-update.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import {
  Injectable,
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getMyInfo(userUpdate: UserUpdateDTO, user: User): Promise<User> {
    const found = await this.usersRepository.findOne(user.id);

    return found;
  }
  async userUpdate(userUpdate: UserUpdateDTO, user: User) {
    await this.usersRepository.update(user.id, userUpdate);
    return { ...user, ...userUpdate };
  }

  async getUserInfo(userId: number) {
    const { refreshToken, coin, createdAt, updatedAt, ...res } =
      await this.usersRepository.findOne({
        id: userId,
      });
    if (!res) {
      throw new NotFoundException(` 존재하지 않는 유저입니다 `);
    }
    return res;
  }
  //개발용 모든 유저 목록
  list() {
    return this.usersRepository.list();
  }
}
