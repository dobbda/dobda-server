import { CoreEntity } from 'src/common/entites/core.entity';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum NotiType {
  ANSWER = 0, //답변
  COMMENT, // 댓글
  ACCEPT, // 채택
  INCOME, // 출금
  OUTCOME, // 입금
	// SELECT, // 외주 거래시작 (거래할 유저 선택함)
	// C2BPAY, // 유저가 금액 결제 완료 (결제 금액은 웹계좌에 저장))
	// B2CPAY, // 웹이 프리랜서에게 지급 완료 (웹계좌에서 프리랜서에게 지불))
}

@Entity()
export class Noti extends CoreEntity {
  @ApiProperty({
    description: '알림 타입',
    required: true,
  })
  @Column({
    type: 'enum',
    enum: NotiType,
    nullable: false,
  })
  type: NotiType;

  @ApiProperty({
    description: '알림 내용',
    required: true,
  })
  @Column()
  content: string;

  @ApiProperty({
    description: '알림 확인 여부',
    required: true,
  })
  @Column({ default: false })
  checked: boolean;

  @ApiProperty({
    description: '알림 대상',
    required: true,
  })
  @ManyToOne((type) => User, (user) => user.notis)
  to: User;
}
