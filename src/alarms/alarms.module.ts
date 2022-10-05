import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsController } from './alarms.controller';
import { AlarmsService } from './alarms.service';
import { AlarmsRepository } from './repositories/alarms.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmsRepository])],
  controllers: [AlarmsController],
  providers: [AlarmsService],
  exports: [TypeOrmModule, AlarmsService],
})
export class AlarmModule {}
