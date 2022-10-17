import {
  PaginationOuput,
  PaginationDto,
} from './../../common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Payment } from '../entities/payments.entity';

export class GetPaymentDto extends PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '아이디' })
  userId: number;
}
