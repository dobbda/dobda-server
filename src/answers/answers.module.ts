import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { AnswersRepository } from './repositories/answers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AnswersRepository, QuestionsRepository])],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
