import { Tag } from 'src/questions/entities/tag.entity';
import { EntityRepository, Repository } from 'typeorm';
import { OutSourcingTag } from '../entities/outSourcingTag.entity';

@EntityRepository(OutSourcingTag)
export class OutSourcingTagRepository extends Repository<OutSourcingTag> {
  async createOutSourcingTags(outSourcingId: number, tags: Tag[]) {
    const values = tags.map((tag) =>
      this.create({ outSourcingId, tagId: tag.id }),
    );
    await this.createQueryBuilder()
      .insert()
      .into(OutSourcingTag)
      .values([...values])
      .execute();
    return true;
  }
}
