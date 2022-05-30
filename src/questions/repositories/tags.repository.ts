import { EntityRepository, Repository } from 'typeorm';
import { CreateTagsDto } from '../dtos/create-tags.dto';
import { Tag } from '../entities/tag.entity';

@EntityRepository(Tag)
export class TagsRepository extends Repository<Tag> {
  async createTags({ names }: CreateTagsDto) {
    //현재 존재하는 tags 찾기
    const existTags = await this.existTags(names);
    //parameter로 받은 names중 존재하지 않는 tag name 찾기
    const newTageNames = [];
    for (let name of names) {
      let isExist = false;
      for (let existTag of existTags) {
        if (existTag.name == name) isExist = true;
      }
      if (!isExist) newTageNames.push(name);
    }
    //존재하지 않는 tag name이 있다면 insert
    if (newTageNames.length > 0) {
      await Promise.allSettled(
        newTageNames.map((newTageName) =>
          this.save(this.create({ name: newTageName })),
        ),
      );
    }
    return this.existTags(names);
  }

  async existTags(tags: string[]): Promise<Tag[]> {
    return this.createQueryBuilder('tag')
      .where('tag.name IN(:...tags)', { tags })
      .getMany();
  }
}
