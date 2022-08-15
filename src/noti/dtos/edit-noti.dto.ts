import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ViewNotiDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '알림 아이디' })
  id: number;
}
