import { EnquiriesRepository } from '../enquiries/repositories/enquiries.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotiModule } from 'src/noti/notis.module';
import { NotisService } from 'src/noti/notis.service';
import { NotisRepository } from 'src/noti/repositories/notis.repository';
import {RepliesRepository } from './repositories/replies.repository';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

@Module({
  imports: [NotiModule, TypeOrmModule.forFeature([RepliesRepository,EnquiriesRepository, NotisRepository])],
  controllers: [RepliesController],
  providers: [RepliesService, NotisService],
})
export class RepliesModule {}
