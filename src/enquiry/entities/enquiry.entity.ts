import { CoreEntity } from 'src/common/entites/core.entity';

import { User } from 'src/users/entities/user.entity';
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
import { Reply } from 'src/replies/entities/reply.entity';

@Entity()
export class Enquiry extends CoreEntity {
  @Column()
  content: string;

  @ManyToOne((type) => User, (user) => user.enquiry)
  author: User;

  @RelationId((enquiry: Enquiry) => enquiry.author)
  authorId: number;

  @ManyToOne((type) => OutSourcing, (outSourcing) => outSourcing.enquiry, {
    onDelete: 'CASCADE',
  })
  outSourcing: OutSourcing;

  @OneToMany((type) => Reply, (reply) => reply.enquiry, {
    cascade: true,
  })
  replies: Reply[];

  @RelationId((enquiry: Enquiry) => enquiry.outSourcing)
  outSourcingId: number;

  @Column({ default: 0 })
  repliesCount: number;

  @OneToOne((type) => OutSourcing, (outSourcing) => outSourcing.pickEnquiry)
  pick_outSourcing: OutSourcing;

  // 채택 여부
  @Column({ default: false })
  picked: boolean;
}
