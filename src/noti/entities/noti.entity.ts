import { CoreEntity } from 'src/common/entites/core.entity';
import { Question } from 'src/questions/entities/question.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Noti extends CoreEntity {
  @Column()
  content: string;
}
