import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/users.repository';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { TransactionsRepository } from './repositories/transactions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionsRepository, UsersRepository]),
  ],
  controllers: [CoinController],
  providers: [CoinService],
})
export class CoinModule {}
