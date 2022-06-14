import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { QuestionsRepository } from './repositories/questions.repository';
import { QuestionTagsRepository } from './repositories/questionTags.repository';
import { TagsRepository } from './repositories/tags.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionsRepository,
      TagsRepository,
      QuestionTagsRepository,
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
