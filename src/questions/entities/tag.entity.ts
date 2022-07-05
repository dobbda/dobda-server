import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { FeatureRequestTag } from 'src/featureRequest/entities/featureRequestTag.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { QuestionTag } from './questionTag.entity';

@Entity()
export class Tag extends CoreEntity {
  @ApiProperty({
    description: '태그 이름',
    required: true,
  })
  @IsNotEmpty()
  @Column()
  name: string;

  @OneToMany((type) => QuestionTag, (questionTag) => questionTag.tagId)
  questionTags: QuestionTag[];

  @OneToMany(
    (type) => FeatureRequestTag,
    (featureRequestTag) => featureRequestTag.tagId,
  )
  featureRequestTags: FeatureRequestTag[];
}
