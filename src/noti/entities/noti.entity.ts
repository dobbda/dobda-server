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
