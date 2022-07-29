import { Answer } from 'src/answers/entities/answer.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
  @Column()
  content: string;

  @ManyToOne((type) => User, (user) => user.comments)
  author: User;

  @ManyToOne((type) => Answer, (answer) => answer.comments)
  answer: Answer;
}
