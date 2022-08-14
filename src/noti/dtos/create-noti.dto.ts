import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { NotiType } from '../entities/noti.entity';

export class CreateNotiDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '타입' })
  readonly type: NotiType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @ApiProperty({ description: '유저' })
  readonly to: User;
}
