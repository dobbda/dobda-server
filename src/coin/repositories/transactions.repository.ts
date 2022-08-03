import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@EntityRepository(Transaction)
export class TransactionsRepository extends Repository<Transaction> {
  async createTransaction(
    value: number,
    fromUser: User,
    toUser: User,
  ): Promise<Transaction> {
    return this.save(this.create({ fromUser, toUser, value }));
  }
}
