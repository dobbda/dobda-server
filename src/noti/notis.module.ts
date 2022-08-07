import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { NotisController } from './notis.controller';
import { NotisService } from './notis.service';
import { NotisRepository } from './repositories/answers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NotisRepository])],
  controllers: [NotisController],
  providers: [NotisService],
})
export class NotiModule {}
