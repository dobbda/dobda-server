import { UsersRepository } from './users.repository';
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  //개발용 모든 유저 목록
  list() {
    return this.usersRepository.list();
  }
}
