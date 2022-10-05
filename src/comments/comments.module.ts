import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersRepository } from 'src/answers/repositories/answers.repository';
import { AlarmModule } from 'src/alarms/alarms.module';
import { AlarmsService } from 'src/alarms/alarms.service';
import { AlarmsRepository } from 'src/alarms/repositories/alarms.repository';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [
    AlarmModule,
    TypeOrmModule.forFeature([
      CommentsRepository,
      AnswersRepository,
      AlarmsRepository,
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, AlarmsService],
})
export class CommentsModule {}
