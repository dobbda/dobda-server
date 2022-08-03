import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Transaction extends CoreEntity {
  @ManyToOne((type) => User, (user: User) => user.transactionsFrom)
  fromUser: User;

  @ManyToOne((type) => User, (user: User) => user.transactionsTo)
  toUser: User;

  @ApiProperty({ description: '거래 금액' })
  @IsNumber()
  @Column()
  value: number;
}
