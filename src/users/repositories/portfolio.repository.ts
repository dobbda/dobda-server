import { Portfolio } from './../entities/portfolio.entity';
import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePortfolio } from '../dtos/portfolio.dto';

@EntityRepository(Portfolio)
export class PortfolioRepository extends Repository<Portfolio> {
  async createPortfolio(
    createPortfolioDto: CreatePortfolio,
    user: User,
  ): Promise<Portfolio> {
    // const portfolio = this.create({ ...createPortfolioDto, user });
    // await this.save(this.create({ ...createPortfolioDto, user }));
    return this.save(this.create({ ...createPortfolioDto, user }));
  }

  //개발용 모든 유저 목록
  async findAll(page: number, keyword?: string) {
    const userQuery = this.createQueryBuilder('portfolio');
    if (keyword) {
      userQuery.where(':skill = ANY (portfolio.skill)', { skill: keyword });
      userQuery.orWhere(':position = ANY (portfolio.position)', {
        position: keyword,
      });
    }
    userQuery
      .take(10)
      .skip((page - 1) * 10)
      .leftJoin('portfolio.user', 'user')
      .addSelect(['user.email', 'user.nickname', 'user.id', 'user.avatar'])
      .orderBy('portfolio.updatedAt', 'DESC');

    const [portfolio, total] = await userQuery.getManyAndCount();
    return {
      portfolio,
      total,
    };
  }
}
