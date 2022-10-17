import { EntityRepository, Repository } from 'typeorm';
import { CreateHistoryDto } from '../dtos/coinHistory.dto';
import { CoinHistory } from '../entities/coinHistory.entity';

@EntityRepository(CoinHistory)
export class CoinHistorysRepository extends Repository<CoinHistory> {
  async createCoinHistory(
    createCoinHistory: CreateHistoryDto,
  ): Promise<CoinHistory> {
    return this.save(this.create({ ...createCoinHistory }));
  }

  async findAll(userId: number, page: number) {
    const history = this.createQueryBuilder('coinHistory')
      .take(50)
      .skip((page - 1) * 50)
      .where('coinHistory.user.id = :userId', {
        userId,
      });
    const [hists, total] = await history.getManyAndCount();

    return {
      hists,
      total,
    };
  }
}
