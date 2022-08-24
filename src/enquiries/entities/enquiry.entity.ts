import { CoreEntity } from 'src/common/entites/core.entity';

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
import { OutSourcing } from 'src/outSourcing/entities/outSourcing.entity';

@Entity()
export class Enquiry extends CoreEntity {
  @Column()
  content: string;

  // 채택 여부
  @Column({ default: false })
  selected: boolean;

  @ManyToOne((type) => User, (user) => user.enquiries)
  author: User;

  @RelationId((enquiry: Enquiry) => enquiry.author)
  authorId: number;

  @ManyToOne((type) => OutSourcing, (outSourcing) => outSourcing.enquiries)
  outSourcing: OutSourcing;

  @RelationId((enquiry: Enquiry) => enquiry.outSourcing)
  outSourcingId: number;

  @Column({ default: 0 })
  commentsCount: number;

  @OneToOne((type) => OutSourcing)
  @JoinColumn()
  selected_enquiry: OutSourcing;

  @OneToMany((type) => Comment, (comment) => comment.enquiry)
  comments: Comment[];
}
