import { EntityRepository, Repository } from 'typeorm';
import { CreateTagsDto } from '../dtos/create-question.dto';
import { Tag } from '../entities/tag.entity';

@EntityRepository(Tag)
export class TagsRepository extends Repository<Tag> {
  async createNonExistTags(tagNames: string[]) {
    //현재 존재하는 tags 찾기
    const existTags = await this.existTags(tagNames);
    //parameter로 받은 names중 존재하지 않는 tag name 찾기
    const newTageNames = [];
    for (let name of tagNames) {
      let isExist = false;
      for (let existTag of existTags) {
        if (existTag.name == name) {
          isExist = true;
          break;
        }
      }
      if (!isExist) newTageNames.push(name);
    }
    //존재하지 않는 tagName이 있다면 insert
    if (newTageNames.length > 0) {
      const values = newTageNames.map((newTageName) =>
        this.create({ name: newTageName }),
      );
      await this.createQueryBuilder()
        .insert()
        .into(Tag)
        .values([...values])
        .execute();
    }
    return this.existTags(tagNames);
  }

  async existTags(tags: string[]): Promise<Tag[]> {
    return this.createQueryBuilder('tag')
      .where('tag.name IN(:...tags)', { tags })
      .getMany();
  }

  async allTagsInQuestion(questionId: number) {
    return this.createQueryBuilder('tag')
      .select(['tag.name'])
      .leftJoin('tag.questionTags', 'questionTags')
      .where('questionTags.questionId = :questionId', { questionId })
      .getMany();
  }

  async allTagsInOutSourcing(outSourcingId: number) {
    return this.createQueryBuilder('tag')
      .select(['tag.name'])
      .leftJoin('tag.outSourcingTags', 'outSourcingTags')
      .where('outSourcingTags.outSourcingId = :outSourcingId', {
        outSourcingId,
      })
      .getMany();
  }
}
