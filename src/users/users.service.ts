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
    if (!pf) {
      // 없을시 생성
      return await this.pfRepository.createPortfolio(
        {
          content: JSON.stringify(data?.content),
          card: JSON.stringify(data?.card),
          public: data.public,
        },
        user,
      );
    }

    await this.pfRepository.save([
      {
        id: pf.id,
        content: JSON.stringify(data?.content),
        card: JSON.stringify(data?.card),
        public: data.public,
      },
    ]);

    return true;
  }

  async getOnePortfolio(userId: number) {
    const { card, content, ...res } = await this.pfRepository.findOne({
      user: { id: userId },
    });
    return {
      card: JSON.parse(card),
      content: JSON.parse(content),
      ...res,
    };
  }

  async getManyPortfolio(page: number) {
    const { portfolio, total } = await this.pfRepository.findAll(page);
    console.log('a: ', portfolio);
    return {
      total,
      result: portfolio.map(({ card, content, ...res }) => {
        console.log('b: ', card, content);

        return {
          card: JSON.parse(card) || card,
          content: JSON.parse(content) || content,
          ...res,
        };
      }),
      totalPages: Math.ceil(total / 10),
    };
  }
}
