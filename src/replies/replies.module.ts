import { UsersRepository } from './../users/users.repository';
import { OutSourcingRepository } from './../outSourcing/repositiories/outSourcing.repository';
import { EnquiryRepository } from '../enquiry/repositories/enquiry.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmModule } from 'src/alarms/alarms.module';
import { AlarmsService } from 'src/alarms/alarms.service';
import { AlarmsRepository } from 'src/alarms/repositories/alarms.repository';
import { RepliesRepository } from './repositories/replies.repository';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

@Module({
  imports: [
    AlarmModule,
    TypeOrmModule.forFeature([
      RepliesRepository,
      EnquiryRepository,
      OutSourcingRepository,
      AlarmsRepository,
      UsersRepository,
    ]),
  ],
  controllers: [RepliesController],
  providers: [RepliesService, AlarmsService],
})
export class RepliesModule {}
