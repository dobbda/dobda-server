import { CoreEntity } from 'src/common/entites/core.entity';
import { Tag } from 'src/questions/entities/tag.entity';
import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { OutSourcing } from './outSourcing.entity';

@Entity()
export class OutSourcingTag extends CoreEntity {
  @ManyToOne(
    (type) => OutSourcing,
    (outSourcing) => outSourcing.outSourcingTags,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'outSourcingId' })
  outSourcingId: number;

  @ManyToOne((type) => Tag, (tag) => tag.outSourcingTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tagId' })
  tagId: number;
}
