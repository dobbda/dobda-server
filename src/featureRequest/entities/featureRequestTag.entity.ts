import { CoreEntity } from 'src/common/entites/core.entity';
import { Tag } from 'src/questions/entities/tag.entity';
import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { FeatureRequest } from './featureRequest.entity';

@Entity()
export class FeatureRequestTag extends CoreEntity {
  @ManyToOne(
    (type) => FeatureRequest,
    (featureRequest) => featureRequest.featureRequestTags,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'featureRequestId' })
  featureRequestId: number;

  @ManyToOne((type) => Tag, (tag) => tag.featureRequestTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tagId' })
  tagId: number;
}
