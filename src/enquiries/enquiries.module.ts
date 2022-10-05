import { OutSourcingRepository } from './../outSourcing/repositiories/outSourcing.repository';
import { AlarmsRepository } from 'src/alarms/repositories/alarms.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from 'src/alarms/alarms.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { EnquiriesController } from './enquiries.controller';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesRepository } from './repositories/enquiries.repository';
import { AlarmModule } from 'src/alarms/alarms.module';

@Module({
  imports: [
    AlarmModule,
    TypeOrmModule.forFeature([
      EnquiriesRepository,
      OutSourcingRepository,
      AlarmsRepository,
    ]),
  ],
  controllers: [EnquiriesController],
  providers: [EnquiriesService, AlarmsService],
  exports: [EnquiriesService, TypeOrmModule],
})
export class EnquiriesModule {}
