import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { NotisService } from 'src/noti/notis.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsRepository, AnswersRepository])],
  controllers: [CommentsController],
  providers: [CommentsService, NotisService],
})
export class CommentsModule {}
