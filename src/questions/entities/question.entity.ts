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
} from 'typeorm';
import { QuestionTag } from './questionTag.entity';

@Entity()
export class Question extends CoreEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  watch: number;

  @Column({ nullable: true })
  coin?: number;

  @ManyToOne((type) => User, (user) => user.questions)
  author: User;

  @OneToMany((type) => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany((type) => QuestionTag, (questionTag) => questionTag.questionId)
  questionTags: QuestionTag[];

  @OneToOne((type) => Answer)
  @JoinColumn()
  accepted_answer: Answer;
}
