import { CoinHistorysRepository } from './repositories/coinHistory.repository';
import { UsersRepository } from './../users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentsRepository } from './repositories/payment.repository';
import { CoinReservsRepository } from './repositories/coinReserv.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentsRepository,
      UsersRepository,
      CoinHistorysRepository,
      CoinReservsRepository,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService],
})
export class PaymentModule {}
