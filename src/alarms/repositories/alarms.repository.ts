import { NotFoundException } from '@nestjs/common';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateAlarmDto } from '../dtos/create-alarm.dto';
import { Alarm } from '../entities/alarm.entity';

@EntityRepository(Alarm)
export class AlarmsRepository extends Repository<Alarm> {
  async createAlarm(createAlarm: CreateAlarmDto): Promise<Alarm> {
    return this.save(this.create({ ...createAlarm }));
  }

  async findOneAlarmWithId(alarmId: number) {
    const alarm = this.createQueryBuilder('alarm').where(
      'alarm.id = :alarmId',
      {
        alarmId,
      },
    );
    return alarm.getOne();
  }
}
