import { UsersModule } from './../users/users.module';
import { QuestionsModule } from './../questions/questions.module';
import { CoinHistorysRepository } from './../payment/repositories/coinHistory.repository';
import { PaymentModule } from './../payment/payment.module';
import { PaymentService } from './../payment/payment.service';
import { PaymentsRepository } from '../payment/repositories/payment.repository';
import { UsersRepository } from './../users/users.repository';
import { AlarmsRepository } from 'src/alarms/repositories/alarms.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from 'src/alarms/alarms.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnswersRepository } from './repositories/answers.repository';
import { AlarmModule } from 'src/alarms/alarms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnswersRepository,
      QuestionsRepository,
      UsersRepository,
    ]),
    AlarmModule,
    PaymentModule,
    UsersModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService, AlarmsService, PaymentService],
  exports: [AnswersService, TypeOrmModule],
})
export class AnswersModule {}
