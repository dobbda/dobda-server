import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Image extends CoreEntity {
  @ApiProperty({
    description: '파일 URL',
    required: true,
  })
  @Column()
  @IsString()
  url: string;

  @ManyToOne((type) => Question, (question) => question.id)
  question: Question;
}
