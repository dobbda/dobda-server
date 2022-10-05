import { EnquiriesRepository } from '../enquiries/repositories/enquiries.repository';
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
      EnquiriesRepository,
      AlarmsRepository,
    ]),
  ],
  controllers: [RepliesController],
  providers: [RepliesService, AlarmsService],
})
export class RepliesModule {}
