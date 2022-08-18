import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { OutSourcingTag } from 'src/outSourcing/entities/outSourcingTag.entity';
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

  @OneToMany((type) => OutSourcingTag, (outSourcingTag) => outSourcingTag.tagId)
  outSourcingTags: OutSourcingTag[];
}
