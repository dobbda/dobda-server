import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { PayType } from '../entities/payments.entity';

export class CreatePaymentDto {
  @ApiProperty({ description: 'value' })
  readonly banckId: number;
}
