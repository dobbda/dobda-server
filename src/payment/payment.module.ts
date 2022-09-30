import { UsersRepository } from './../users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentsRepository } from './repository.ts/payment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsRepository, UsersRepository])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService],
})
export class PaymentModule {}
