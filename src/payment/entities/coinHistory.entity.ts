import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PayType } from './payments.entity';

@Entity()
export class CoinHistory extends CoreEntity {
  @Column({
    type: 'enum',
    enum: PayType,
    nullable: false,
  })
  type: PayType;

  @Column()
  @IsNumber()
  coin: number;

  @ManyToOne((type) => User, (user: User) => user.coinHistory)
  user: User;

  @Column({ default: null })
  @IsNumber()
  toUserId?: number;

  @Column({ default: null })
  questionId?: number;

  @Column({ default: null })
  outSourcingId?: number;
}
