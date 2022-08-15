import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaginationOuput } from 'src/common/dtos/pagination.dto';
import { NotiType } from '../entities/noti.entity';

export class GetNoti {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '아이디' })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '타입' })
  type: NotiType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  content: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: '날짜' })
  createdAt: Date;
}

export class GetNotisOutput {
  notis: GetNoti[];
}
