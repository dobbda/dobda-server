import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Injectable, BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

	async getUserInfo(userId: number): Promise<User> {
		const check = await this.usersRepository.findOne({id:userId})
		if(!check) {
			throw new NotFoundException(` <ID: ${userId}>를 가진 유저가 존재하지 않습니다`);
		}
		return check
	}

  //개발용 모든 유저 목록
  list() {
    return this.usersRepository.list();
  }
}
