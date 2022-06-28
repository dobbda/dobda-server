import { CoreEntity } from 'src/common/entites/core.entity';
import { Tag } from 'src/questions/entities/tag.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FeatureRequest } from './featureRequest.entity';

@Entity()
export class FeatureRequestTag extends CoreEntity {
  @ManyToOne(
    (type) => FeatureRequest,
    (featureRequest) => featureRequest.featureRequestTags,
  )
  @JoinColumn({ name: 'featureRequestId' })
  featureRequestId: number;

  @ManyToOne((type) => Tag, (tag) => tag.featureRequestTags)
  @JoinColumn({ name: 'tagId' })
  tagId: number;
}
