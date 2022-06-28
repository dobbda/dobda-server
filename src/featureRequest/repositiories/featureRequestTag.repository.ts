import { Tag } from 'src/questions/entities/tag.entity';
import { EntityRepository, Repository } from 'typeorm';
import { FeatureRequestTag } from '../entities/featureRequestTag.entity';

@EntityRepository(FeatureRequestTag)
export class FeatureRequestTagRepository extends Repository<FeatureRequestTag> {
  async createFeatureRequestTags(featureRequestId: number, tags: Tag[]) {
    await Promise.allSettled(
      tags.map((tag) =>
        this.save(this.create({ featureRequestId, tagId: tag.id })),
      ),
    );
    return true;
  }
}
