import { OutSourcingRepository } from './../outSourcing/repositiories/outSourcing.repository';
import { NotisRepository } from 'src/noti/repositories/notis.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotisService } from 'src/noti/notis.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { EnquiriesController } from './enquiries.controller';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesRepository } from './repositories/enquiries.repository';
import { NotiModule } from 'src/noti/notis.module';

@Module({
  imports: [NotiModule, TypeOrmModule.forFeature([EnquiriesRepository, OutSourcingRepository, NotisRepository])],
  controllers: [EnquiriesController],
  providers: [EnquiriesService, NotisService],
  exports: [EnquiriesService, TypeOrmModule]
})
export class EnquiriesModule {}
