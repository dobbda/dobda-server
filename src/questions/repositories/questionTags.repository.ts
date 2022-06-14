import { EntityRepository, Repository } from 'typeorm';
import { QuestionTag } from '../entities/questionTag.entity';
import { Tag } from '../entities/tag.entity';

@EntityRepository(QuestionTag)
export class QuestionTagsRepository extends Repository<QuestionTag> {
  async createQuestionTags(questionId: number, tags: Tag[]) {
    await Promise.allSettled(
      tags.map((tag) => this.save(this.create({ questionId, tagId: tag.id }))),
    );
    return true;
  }
}
