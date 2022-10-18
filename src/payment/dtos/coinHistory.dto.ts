import { CoinHistory } from './../entities/coinHistory.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaginationOuput } from 'src/common/dtos/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { PayType } from '../entities/payments.entity';

export class CreateHistoryDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '타입' })
  readonly type: PayType;

  @ApiProperty({ description: 'value' })
  readonly coin: number;

  @ApiProperty({ description: 'author' })
  readonly user: User;

  @ApiProperty({ description: 'if user to user ' })
  readonly toUserId?: number;
}

export class CoinHistoryOut extends PaginationOuput {
  result: CoinHistory[];
}
