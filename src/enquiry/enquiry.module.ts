import { OutSourcingRepository } from '../outSourcing/repositiories/outSourcing.repository';
import { AlarmsRepository } from 'src/alarms/repositories/alarms.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from 'src/alarms/alarms.service';
import { QuestionsRepository } from 'src/questions/repositories/questions.repository';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
import { EnquiryRepository } from './repositories/enquiry.repository';
import { AlarmModule } from 'src/alarms/alarms.module';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Module({
  imports: [
    AlarmModule,
    TypeOrmModule.forFeature([
      EnquiryRepository,
      OutSourcingRepository,
      AlarmsRepository,
      UsersRepository,
    ]),
  ],
  controllers: [EnquiryController],
  providers: [EnquiryService, AlarmsService],
  exports: [EnquiryService, TypeOrmModule],
})
export class EnquiryModule {}
