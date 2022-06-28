import { Tag } from 'src/questions/entities/tag.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { FeatureRequestTag } from '../entities/featureRequestTag.entity';

@EntityRepository(FeatureRequestTag)
export class FeatureRequestTagRepository extends Repository<FeatureRequestTag> {
  async createFeatureRequestTags(featureRequestId: number, tags: Tag[]) {
    const values = tags.map((tag) =>
      this.create({ featureRequestId, tagId: tag.id }),
    );
    await this.createQueryBuilder()
      .insert()
      .into(FeatureRequestTag)
      .values([...values])
      .execute();
    return true;
  }
}
