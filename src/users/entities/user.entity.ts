import { Answer } from 'src/answers/entities/answer.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export class SkillName {
  name: string;
}

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column({ type: 'json' })
  skill: SkillName[];

  @Column({ default: 0 })
  coin: number;

  @Column({ default: 0 })
  score: number;

  // @OneToMany((type) => Question, (question) => question.author)
  // questions: Question[];

  @OneToMany((type) => Answer, (answer) => answer.author)
  answers: Answer[];
}
