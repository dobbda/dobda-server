import { PaymentModule } from './../payment/payment.module';
import { PaymentService } from './../payment/payment.service';
import { PaymentsRepository } from './../payment/repository.ts/payment.repository';
import { UsersRepository } from './../users/users.repository';
import { NotisRepository } from 'src/noti/repositories/notis.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotisService } from 'src/noti/notis.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnswersRepository } from './repositories/answers.repository';
import { NotiModule } from 'src/noti/notis.module';

@Module({
  imports: [
    NotiModule,
    PaymentModule,
    TypeOrmModule.forFeature([
      AnswersRepository,
      QuestionsRepository,
      NotisRepository,
      UsersRepository,
      PaymentsRepository,
    ]),
  ],
  controllers: [AnswersController],
  providers: [AnswersService, NotisService, PaymentService],
  exports: [AnswersService, TypeOrmModule],
})
export class AnswersModule {}
