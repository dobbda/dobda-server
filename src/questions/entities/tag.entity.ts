import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { QuestionTag } from './questionTag.entity';

@Entity()
export class Tag extends CoreEntity {
  @Column()
  name: string;

  @OneToMany((type) => QuestionTag, (questionTag) => questionTag.tagId)
  questionTags: QuestionTag[];
}
