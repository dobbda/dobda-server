import { Answer } from 'src/answers/entities/answer.entity';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Enquiry } from 'src/enquiries/entities/enquiry.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
  @Column()
  content: string;

  @ManyToOne((type) => User, (user) => user.comments)
  author: User;

  @RelationId((answer: Answer) => answer.author)
  authorId: number;

  @ManyToOne((type) => Answer, (answer) => answer.comments)
  answer: Answer;

  @RelationId((comment: Comment) => comment.answer)
  answerId: number;

  @ManyToOne((type) => Enquiry, (enquiry) => enquiry.comments)
  enquiry: Enquiry;
	
  @RelationId((comment: Comment) => comment.enquiry)
  enquiryId: number;
}
