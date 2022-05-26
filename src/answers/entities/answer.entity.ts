import { CoreEntity } from 'src/common/entites/core.entity';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Answer extends CoreEntity {
  @Column()
  content: string;

  // 채택 여부
  @Column({ default: false })
  accepted: boolean;

  @ManyToOne((type) => User, (user) => user.answers)
  author: User;

  @ManyToOne((type) => Question, (question) => question.answers)
  question: Question;

  @OneToOne((type) => Question)
  @JoinColumn()
  accepted_question: Question;
}
