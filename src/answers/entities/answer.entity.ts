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
  RelationId,
} from 'typeorm';

@Entity()
export class Answer extends CoreEntity {
  @Column()
  content: string;

  // 채택 여부
  @Column({ default: false })
  accepted: boolean;

  @ManyToOne((type) => User, (user) => user.answers)
  author: User;

  @RelationId((answer: Answer) => answer.author)
  authorId: number;

  @ManyToOne((type) => Question, (question) => question.answers)
  question: Question;

  @RelationId((answer: Answer) => answer.question)
  questionId: number;

  @Column({ default: 0 })
  commentsCount: number;

  @OneToOne((type) => Question, (question) => question.acceptedAnswer, {
    cascade: ['update', 'insert'], //update insert
  })
  accepted_question: Question;

  @OneToMany((type) => Comment, (comment) => comment.answer)
  comments: Comment[];
}
