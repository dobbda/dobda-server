import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { Question } from 'src/questions/entities/question.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  RelationId,
} from 'typeorm';
import { PayType } from './payments.entity';

// 코인 임시 저장소
@Entity()
export class CoinReserv extends CoreEntity {
  @Column()
  type: PayType; //출금

  @ManyToOne((type) => User, (user: User) => user.coinReservs)
  user: User;

  @Column()
  @IsNumber()
  coin: number;

  @OneToOne((type) => Question, (question: Question) => question.coinReserv)
  @JoinColumn()
  question: Question; // 질문

  @RelationId((reserv: CoinReserv) => reserv.question)
  questionId: number;

  @OneToOne(
    (type) => OutSourcing,
    (outSourcing: OutSourcing) => outSourcing.coinReserv,
  )
  @JoinColumn()
  outSourcing: OutSourcing; // 외주

  @RelationId((reserv: CoinReserv) => reserv.outSourcing)
  outSourcingId: number;
}
