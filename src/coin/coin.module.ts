import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { TransactionsRepository } from './repositories/transactions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsRepository])],
  controllers: [CoinController],
  providers: [CoinService],
})
export class CoinModule {}
