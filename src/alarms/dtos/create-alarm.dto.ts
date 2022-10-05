import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { AlarmType } from '../entities/alarm.entity';

export class CreateAlarmDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '타입' })
  readonly type: AlarmType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @ApiProperty({ description: '유저' })
  readonly to: User;
}
