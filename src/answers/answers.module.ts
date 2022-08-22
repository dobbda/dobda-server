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
  imports: [NotiModule, TypeOrmModule.forFeature([AnswersRepository, QuestionsRepository, NotisRepository])],
  controllers: [AnswersController],
  providers: [AnswersService, NotisService],
  exports: [AnswersService, TypeOrmModule]
})
export class AnswersModule {}
