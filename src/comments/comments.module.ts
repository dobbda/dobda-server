import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { NotiModule } from 'src/noti/notis.module';
import { NotisService } from 'src/noti/notis.service';
import { NotisRepository } from 'src/noti/repositories/notis.repository';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [NotiModule, TypeOrmModule.forFeature([CommentsRepository, AnswersRepository, NotisRepository])],
  controllers: [CommentsController],
  providers: [CommentsService, NotisService],
})
export class CommentsModule {}
