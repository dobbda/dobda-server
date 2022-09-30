import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
export enum PayType {
  BANK = 0, // 입출금
  QUESTION, // 채택
  OUTSOURCING, // 외주
}

@Entity()
export class Payment extends CoreEntity {
  @ApiProperty({
    description: '코인 증감 유형',
    required: true,
  })
  @Column({
    type: 'enum',
    enum: PayType,
    nullable: false,
  })
  type: PayType;

  @ManyToOne((type) => User, (user: User) => user.payments)
  user: User;

  @ApiProperty({
    description: 'if user to user',
  })
  @Column({ default: null })
  @IsNumber()
  toUserId: number;

  @ApiProperty({
    description: '금액 +-',
    required: true,
  })
  @Column()
  @IsNumber()
  coin: number;
}
