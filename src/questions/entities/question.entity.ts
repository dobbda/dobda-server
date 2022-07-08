import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Answer } from 'src/answers/entities/answer.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';
import { QuestionTag } from './questionTag.entity';

@Entity()
export class Question extends CoreEntity {
  @ApiProperty({
    description: '질문 제목',
    required: true,
  })
  @Column()
  @IsString()
  title: string;

  @ApiProperty({
    description: '질문 내용',
    required: true,
  })
  @Column()
  @IsString()
  content: string;

  @ApiProperty({
    description: '질문 조회 수',
    default: 0,
  })
  @Column({ default: 0 })
  watch: number;

  @ApiProperty({
    description: '질문 코인',
    default: 0,
  })
  @Column({ nullable: true, default: 0 })
  @IsNumber()
  coin: number;

  @ManyToOne((type) => User, (user) => user.questions)
  author: User;

  @OneToMany((type) => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany((type) => QuestionTag, (questionTag) => questionTag.questionId)
  questionTags: QuestionTag[];

  @OneToOne((type) => Answer)
  @JoinColumn()
  accepteAnswer: Answer;

  @ApiProperty({
    description: '질문 작성자 id',
  })
  @RelationId((question: Question) => question.author)
  authorId: number;

  @ApiProperty({
    description: '채택답변 id',
  })
  @RelationId((question: Question) => question.accepteAnswer)
  accepteAnswerId: number;
}
