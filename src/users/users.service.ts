import { CreatePortfolio } from './dtos/portfolio.dto';
import { PortfolioRepository } from './repositories/portfolio.repository';
import { UserUpdateDTO } from './dtos/user-update.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import {
  Injectable,
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private pfRepository: PortfolioRepository,
  ) {}

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

  //////////// portfolio /////////////////////
  async createPortfolio(data: CreatePortfolio, user: User): Promise<Portfolio> {
    return this.pfRepository.createPortfolio(data, user);
  }

  async updatePortfolio(
    data: CreatePortfolio,
    id: number,
    user: User,
  ): Promise<Portfolio> {
    const pf = this.pfRepository.findOne({ id });
    if (!pf) {
      throw new BadRequestException('존재하지않는 글입니다.');
    }
    this.pfRepository.save({
      id,
      ...data,
    });
    return {
      ...pf,
      ...data,
    };
  }

  async getOnePortfolio(userId: number) {
    return this.pfRepository.find({ userId });
  }

  async getAllPortfolio(page: number) {
    const { portfolio, total } = await this.pfRepository.findAll(page);
    return {
      total,
      result: portfolio.map(({ content, ...v }) => {
        return {
          ...v,
          // card: JSON.parse(card),
          // content:JSON.parse(content)
        };
      }),
      totalPages: Math.ceil(total / 10),
    };
  }
}
