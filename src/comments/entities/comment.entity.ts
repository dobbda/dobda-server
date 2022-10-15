import { Answer } from 'src/answers/entities/answer.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Enquiry } from 'src/enquiry/entities/enquiry.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
  @Column()
  content: string;

  @ManyToOne((type) => User, (user) => user.comments)
  author: User;

  @RelationId((comment: Comment) => comment.author)
  authorId: number;

  @ManyToOne((type) => Answer, (answer) => answer.comments, {
    onDelete: 'CASCADE',
  })
  answer: Answer;

  @RelationId((comment: Comment) => comment.answer)
  answerId: number;
}
