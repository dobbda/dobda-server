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
  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  content: string;

  @Column({ default: 0 })
  watch: number;

  @Column({ nullable: true, default: 0 })
  @IsNumber()
  coin: number;

  @Column({ type: 'date' })
  deadline: Date;

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

  @RelationId((featureRequest: FeatureRequest) => featureRequest.author)
  authorId: number;
}
