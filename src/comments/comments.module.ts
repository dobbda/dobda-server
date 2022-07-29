import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsRepository, AnswersRepository])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
