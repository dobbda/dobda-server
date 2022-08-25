import { CoreEntity } from 'src/common/entites/core.entity';
import { Enquiry } from 'src/enquiries/entities/enquiry.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Reply extends CoreEntity {
  @Column()
  content: string;

  @ManyToOne((type) => User, (user) => user.replies)
  author: User;

  @RelationId((reply: Reply) => reply.author)
  authorId: number;


  @ManyToOne((type) => Enquiry, (enquiry) => enquiry.replies)
  enquiry: Enquiry;
	
  @RelationId((reply: Reply) => reply.enquiry)
  enquiryId: number;
}
