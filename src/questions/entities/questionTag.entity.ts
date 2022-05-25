import { CoreEntity } from 'src/common/entites/core.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Question } from './question.entity';
import { Tag } from './tag.entity';

@Entity()
export class QuestionTag extends CoreEntity {
  @ManyToOne((type) => Question, (question) => question.questionTags)
  @JoinColumn({ name: 'questionId' })
  questionId: number;

  @ManyToOne((type) => Tag, (tag) => tag.questionTags)
  @JoinColumn({ name: 'tagId' })
  tagId: number;
}
