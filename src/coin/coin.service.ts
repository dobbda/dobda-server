import { Injectable } from '@nestjs/common';
import { formatWithCursor } from 'prettier';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { SendCoinDto, SendCoinOutput } from './dtos/send-coin.dto';
import { TransactionsRepository } from './repositories/transactions.repository';

@Injectable()
export class CoinService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async sendCoin(
    { value, target }: SendCoinDto,
    user: User,
  ): Promise<SendCoinOutput> {
    /* 이 작업은 Atomic하게 이루어 져야함 */

    /* Redis Locking 필요 */

    if (user.coin > value) {
      return {
        success: 1,
        message: '전송하려는 코인이 보유한 코인보다 많습니다.',
      } as SendCoinOutput;
    }

    const toUser = await this.usersRepository.findUserByEmail(target);

    if (toUser === null) {
      return {
        success: 1,
      } as SendCoinOutput;
    }

    user.coin -= value;
    toUser.coin += value;

    this.usersRepository.save([user, toUser]);
    this.transactionsRepository.createTransaction(value, user, toUser);

    return { success: 1 };
  }
}
