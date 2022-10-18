import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Enquiry } from 'src/enquiry/entities/enquiry.entity';
import { CoinReserv } from 'src/payment/entities/coinReserv.entity';
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
import { Progress } from '../types/progressType';
import { OutSourcingTag } from './outSourcingTag.entity';

@Entity()
export class OutSourcing extends CoreEntity {
  @ApiProperty({
    description: '외주 제목',
    required: true,
  })
  @Column()
  @IsString()
  title: string;

  @Column({ default: '' })
  cardImage: string;

  @ApiProperty({
    description: '외주 내용',
    required: true,
  })
  @Column()
  @IsString()
  content: string;

  @ApiProperty({
    description: '외주 조회 수',
    default: 0,
  })
  @Column({ default: 0 })
  watch: number;

  @ApiProperty({
    description: '외주 코인',
    default: 0,
  })
  @Column({ nullable: true, default: 0 })
  @IsNumber()
  coin: number;

  @ApiProperty({
    description: '외주 마감일',
    required: true,
  })
  @Column({ type: 'date' })
  deadline: Date;

  @ApiProperty({
    description: '외주 진행도',
    enum: Progress,
    default: Progress.Pending,
  })
  @Column({ type: 'enum', enum: Progress, default: Progress.Pending })
  progress: Progress;

  /* 작성자 */
  @ManyToOne((type) => User, (user) => user.outSourcings)
  author: User;

  /* 답변들 */
  @OneToMany((type) => Enquiry, (enquiry) => enquiry.outSourcing, {
    cascade: true,
  })
  enquiry: Enquiry[];

  @OneToMany(
    (type) => OutSourcingTag,
    (outSourcingTag) => outSourcingTag.outSourcingId,
    {
      cascade: true,
    },
  )
  outSourcingTags: OutSourcingTag[];

  @ApiProperty({
    description: '외주 작성자 id',
  })
  @RelationId((outSourcing: OutSourcing) => outSourcing.author)
  authorId: number;

  @Column({ default: 0 })
  enquiryCount: number;

  @ApiProperty({
    description: '선택된 답변',
  })
  @OneToOne((type) => Enquiry, (enquiry) => enquiry.pick_outSourcing, {
    eager: true,
  })
  @JoinColumn()
  pickEnquiry: Enquiry;

  @ApiProperty({
    description: '선택된 답변id',
  })
  @RelationId((outSourcing: OutSourcing) => outSourcing.pickEnquiry)
  pickEnquiryId: number;

  @OneToOne(() => CoinReserv, (coinReserv: CoinReserv) => coinReserv.question)
  coinReserv: CoinReserv; // 외주
}
