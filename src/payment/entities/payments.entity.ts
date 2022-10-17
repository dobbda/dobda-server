import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
export enum PayType {
  BANK = 'withdraw', // 입출금
  QUESTION = 'question', // 채택
  OUTSOURCING = 'sourcing', // 외주
}

@Entity()
export class Payment extends CoreEntity {
  @Column()
  @IsNumber()
  bacnkId: number;
}
