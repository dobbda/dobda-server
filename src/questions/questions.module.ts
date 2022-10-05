import { PaymentsRepository } from '../payment/repositories/payment.repository';
import { AnswersModule } from './../answers/answers.module';
import { AnswersService } from './../answers/answers.service';
import { UsersRepository } from 'src/users/users.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesRepository } from 'src/images/repositories/images.repository';
import { QuestionController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionsRepository } from './repositories/questions.repository';
import { QuestionTagsRepository } from './repositories/questionTags.repository';
import { TagsRepository } from './repositories/tags.repository';
import { AlarmModule } from 'src/alarms/alarms.module';
import { AlarmsRepository } from 'src/alarms/repositories/alarms.repository';
import { AlarmsService } from 'src/alarms/alarms.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    AnswersModule,
    AlarmModule,
    PaymentModule,
    TypeOrmModule.forFeature([
      QuestionsRepository,
      TagsRepository,
      QuestionTagsRepository,
      ImagesRepository,
      UsersRepository,
      AlarmsRepository,
      PaymentsRepository,
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionsService, AnswersService, AlarmsService],
})
export class QuestionsModule {}
