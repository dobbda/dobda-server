import { EntityRepository, Repository } from 'typeorm';
import { QuestionTag } from '../entities/questionTag.entity';
import { Tag } from '../entities/tag.entity';

@EntityRepository(QuestionTag)
export class QuestionTagsRepository extends Repository<QuestionTag> {
  async createQuestionTags(questionId: number, tags: Tag[]) {
    const values = tags.map((tag) =>
      this.create({ questionId, tagId: tag.id }),
    );
    await this.createQueryBuilder()
      .insert()
      .into(QuestionTag)
      .values([...values])
      .execute();
    return true;
  }
}
