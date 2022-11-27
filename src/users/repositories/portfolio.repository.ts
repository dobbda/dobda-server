import { Portfolio } from './../entities/portfolio.entity';
import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreatePortfolio } from '../dtos/portfolio.dto';

@EntityRepository(Portfolio)
export class PortfolioRepository extends Repository<Portfolio> {
  async createPortfolio(
    createPortfolioDto: { card: string; content: string; public?: boolean },
    user: User,
  ): Promise<Portfolio> {
    // const portfolio = this.create({ ...createPortfolioDto, user });
    // await this.save(this.create({ ...createPortfolioDto, user }));
    return this.save(this.create({ ...createPortfolioDto, user }));
  }

  //개발용 모든 유저 목록
  async findAll(page: number) {
    const [portfolio, total] = await this.createQueryBuilder('portfolio')
      .take(10)
      .skip((page - 1) * 10)
      .leftJoin('portfolio.user', 'user')
      .addSelect(['user.email', 'user.nickname', 'user.id', 'user.avatar'])
      .orderBy('portfolio.updatedAt', 'DESC')
      .getManyAndCount();

    return {
      portfolio,
      total,
    };
  }
}
