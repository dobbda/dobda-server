import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Answer } from 'src/answers/entities/answer.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { FeatureRequest } from 'src/featureRequest/entities/featureRequest.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export class SkillName {
  name: string;
}

@Entity()
export class User extends CoreEntity {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 비어있을 수 없습니다.' })
  @Column({ unique: true })
  email: string;

  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 비어있을 수 없습니다.' })
  @Column()
  name: string;

  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임은 비어있을 수 없습니다.' })
  @Column()
  nickname: string;

  @Column({ type: 'json' })
  skill: SkillName[];

  @IsNumber()
  @Column({ default: 0 })
  coin: number;

  @IsNumber()
  @Column({ default: 0 })
  score: number;

  @Column({ nullable: true })
  @Exclude() //노출을 원하지 않는 멤버
  refreshToken?: string;

  @OneToMany((type) => Question, (question: Question) => question.author)
  questions: Question[];

  @OneToMany(
    (type) => FeatureRequest,
    (featureRequest: FeatureRequest) => featureRequest.author,
  )
  featureRequests: FeatureRequest[];

  @OneToMany((type) => Answer, (answer: Answer) => answer.author)
  answers: Answer[];
}
