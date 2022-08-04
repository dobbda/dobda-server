import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto, PaginationOuput } from 'src/common/dtos/pagination.dto';
import { Question } from '../entities/question.entity';
import { Tag } from '../entities/tag.entity';

export class GetQuestionsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'title', required: false })
  title: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'tagId', required: false })
  tagId: number;
}

export class GetQuestionsOutput extends PaginationOuput {
  @ApiProperty({ description: 'result' })
  result: QuestionWithTag[];
}

class QuestionWithTag extends Question {
  @ApiProperty({ description: 'tags' })
  tagNames: Tag[];
}
