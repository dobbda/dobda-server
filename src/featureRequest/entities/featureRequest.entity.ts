import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
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
import { FeatureRequestTag } from './featureRequestTag.entity';

export enum Progress {
  Pending = 'Pending', // 답변 기다리는 중
  Pick = 'Pick', //답변 채택
  Proceeding = 'Proceeding', //기능요청사항 진행중
  Submit = 'Submit', //기능요청사항 제출
  Clear = 'Clear', // 기능요청사항 완료
}

@Entity()
export class FeatureRequest extends CoreEntity {
  @ApiProperty({
    description: '기능요청 제목',
    required: true,
  })
  @Column()
  @IsString()
  title: string;

  @ApiProperty({
    description: '기능요청 내용',
    required: true,
  })
  @Column()
  @IsString()
  content: string;

  @ApiProperty({
    description: '기능요청 조회 수',
    default: 0,
  })
  @Column({ default: 0 })
  watch: number;

  @ApiProperty({
    description: '기능요청 코인',
    default: 0,
  })
  @Column({ nullable: true, default: 0 })
  @IsNumber()
  coin: number;

  @ApiProperty({
    description: '기능요청 마감일',
    required: true,
  })
  @Column({ type: 'date' })
  deadline: Date;

  @ApiProperty({
    description: '기능요청 진행도',
    enum: Progress,
    default: Progress.Pending,
  })
  @Column({ type: 'enum', enum: Progress, default: Progress.Pending })
  progress: Progress;

  /* 작성자 */
  @ManyToOne((type) => User, (user) => user.featureRequests)
  author: User;

  /* 채택답변 */
  @OneToOne((type) => Answer)
  @JoinColumn()
  accepteAnswer: Answer;

  /* 답변들 */
  @OneToMany((type) => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(
    (type) => FeatureRequestTag,
    (featureRequestTag) => featureRequestTag.featureRequestId,
  )
  featureRequestTags: FeatureRequestTag[];

  @ApiProperty({
    description: '기능요청 작성자 id',
  })
  @RelationId((featureRequest: FeatureRequest) => featureRequest.author)
  authorId: number;
}
