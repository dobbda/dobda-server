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

  async updatePortfolio(data: CreatePortfolio, user: User) {
    const pf = await this.pfRepository.findOne({ user });
    const { content, card, ...res } = data;
    if (!pf) {
      // 없을시 생성
      return await this.pfRepository.createPortfolio(
        {
          content: JSON.stringify(data?.content),
          card: JSON.stringify(data?.card),
          ...res,
        },
        user,
      );
    }

    const newData = {
      content: JSON.stringify(content),
      card: JSON.stringify(card),
      ...res,
    };

    await this.pfRepository.save([
      {
        id: pf.id,
        ...newData,
      },
    ]);

    return true;
  }

  async getOnePortfolio(userId: number) {
    const find = await this.pfRepository.findOne({
      user: { id: userId },
    });
    if (!find) return {};
    const { card, content, ...res } = find;
    return {
      card: JSON.parse(card),
      content: JSON.parse(content),
      ...res,
    };
  }

  async getManyPortfolio(page: number) {
    const find = await this.pfRepository.findAll(page);
    if (!find) return find;
    const { portfolio, total } = find;
    return {
      total,
      result: portfolio.map(({ card, content, ...res }) => {
        return {
          card: JSON.parse(card) || card,
          // content: JSON.parse(content) || content,
          ...res,
        };
      }),
      totalPages: Math.ceil(total / 10),
    };
  }
}
