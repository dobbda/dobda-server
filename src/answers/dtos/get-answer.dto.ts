import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { Answer } from '../entities/answer.entity';

export class GetAnswersDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'questionId', required: false })
  qid: number;
}

export class GetAnswersOutput {
  @ApiProperty({ description: 'result' })
  result: Answer[];
}
