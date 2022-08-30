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
import { Transaction } from 'src/coin/entities/transaction.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';
import { Noti } from 'src/noti/entities/noti.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Enquiry } from 'src/enquiries/entities/enquiry.entity';
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
  @Column({ type: 'json', nullable: true })
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

  @OneToMany(
    (type) => Transaction,
    (transaction: Transaction) => transaction.fromUser,
  )
  transactionsFrom: Transaction[];

  @OneToMany(
    (type) => Transaction,
    (transaction: Transaction) => transaction.toUser,
  )
  transactionsTo: Transaction[];

  @OneToMany((type) => Noti, (noti: Noti) => noti.to)
  notis: Noti[];


	@OneToMany((type) => Enquiry, (enquiry: Enquiry) => enquiry.author)
  enquiries: Enquiry[];

	// //////////////////////////////////////////////////////////////////
  @Column({ default: 0 })
  questionsCount: number;

  @Column({ default: 0 })
  getAcceptCount: number;

  @Column({ default: 0 })
	setAcceptCount:number;

  @Column({ default: 0 })
  outSourcingCount: number;

}
