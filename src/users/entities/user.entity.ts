import { Payment } from '../../payment/entities/payments.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Answer } from 'src/answers/entities/answer.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { Alarm } from 'src/alarms/entities/alarm.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Enquiry } from 'src/enquiry/entities/enquiry.entity';
import { Reply } from 'src/replies/entities/reply.entity';

export class SkillName {
  name: string;
}

@Entity()
export class User extends CoreEntity {
  @ApiProperty({
    description: '로그인 이메일',
    required: true,
  })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 비어있을 수 없습니다.' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: '이름',
    required: true,
  })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 비어있을 수 없습니다.' })
  @Column()
  name: string;

  @IsUrl({ message: '아바타는 url문자열이어야 합니다.' })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({
    description: '닉네임',
    required: true,
  })
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임은 비어있을 수 없습니다.' })
  @Column()
  nickname: string;

  @ApiProperty({ description: '스킬' })
  @Column({ type: 'json', nullable: true })
  skill: string[];

  @ApiProperty({ description: '소개' })
  @Column({ nullable: true })
  @IsString()
  description: string;

  @ApiProperty({ description: '코인' })
  @IsNumber()
  @Column({ default: 0 })
  coin: number;

  @ApiProperty({ description: '점수' })
  @IsNumber()
  @Column({ default: 0 })
  score: number;

  @ApiProperty({ description: '리프레시 토큰' })
  @Column({ nullable: true })
  @Exclude() //노출을 원하지 않는 멤버
  refreshToken?: string;

  @OneToMany((type) => Question, (question: Question) => question.author)
  questions: Question[];

  @OneToMany(
    (type) => OutSourcing,
    (outSourcing: OutSourcing) => outSourcing.author,
  )
  outSourcings: OutSourcing[];

  @OneToMany((type) => Answer, (answer: Answer) => answer.author)
  answers: Answer[];

  @OneToMany((type) => Comment, (comment: Comment) => comment.author)
  comments: Comment[];

  @OneToMany((type) => Reply, (reply: Reply) => reply.author)
  replies: Reply[];

  @OneToMany((type) => Payment, (Payment: Payment) => Payment.user)
  payments: Payment[];

  @OneToMany((type) => Alarm, (alarm: Alarm) => alarm.to)
  alarms: Alarm[];

  @OneToMany((type) => Enquiry, (enquiry: Enquiry) => enquiry.author)
  enquiry: Enquiry[];

  // //////////////////////////////////////////////////////////////////
  @Column({ default: 0 })
  questionsCount: number;

  @Column({ default: 0 })
  getAcceptCount: number;

  @Column({ default: 0 })
  setAcceptCount: number;

  @Column({ default: 0 })
  outSourcingCount: number;

  @Column({ default: 0 })
  role: number;
}
