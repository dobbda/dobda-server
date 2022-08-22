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
import { NotiModule } from 'src/noti/notis.module';
import { NotisRepository } from 'src/noti/repositories/notis.repository';
import { NotisService } from 'src/noti/notis.service';

@Module({
  imports: [
		AnswersModule,
		NotiModule,
    TypeOrmModule.forFeature([
      QuestionsRepository,
      TagsRepository,
      QuestionTagsRepository,
      ImagesRepository,
			UsersRepository,
			NotisRepository
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionsService, AnswersService, NotisService],
})
export class QuestionsModule {}
