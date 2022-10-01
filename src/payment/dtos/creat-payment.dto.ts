import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { PayType } from '../entities/payments.entity';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '타입' })
  readonly type: PayType;

  @ApiProperty({ description: 'author' })
  readonly user: User;

  @ApiProperty({ description: 'if user to user ' })
  readonly toUserId?: number;

  @ApiProperty({ description: 'value' })
  readonly coin: number;
}
