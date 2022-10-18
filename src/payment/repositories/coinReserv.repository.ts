import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { Question } from 'src/questions/entities/question.entity';
import { CoinReserv } from 'src/payment/entities/coinReserv.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReservDto } from '../dtos/coinReserv.dto';

@EntityRepository(CoinReserv)
export class CoinReservsRepository extends Repository<CoinReserv> {
  async createCoinReserv(createReserv: CreateReservDto): Promise<CoinReserv> {
    return this.save(this.create({ ...createReserv }));
  }

  async findAll(userId: number, page: number) {
    const history = this.createQueryBuilder('coinReserv')
      .take(50)
      .skip((page - 1) * 50)
      .where('coinReserv.user.id = :userId', {
        userId,
      });
    const [hists, total] = await history.getManyAndCount();

    return {
      hists,
      total,
    };
  }
}
