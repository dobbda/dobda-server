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
import { Image } from 'src/images/entities/image.entity';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
		AnswersModule,
    TypeOrmModule.forFeature([
      QuestionsRepository,
      TagsRepository,
      QuestionTagsRepository,
      ImagesRepository,
			UsersRepository,
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionsService, AnswersService],
})
export class QuestionsModule {}
