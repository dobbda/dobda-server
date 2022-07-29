import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetCommentsDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'answerId', required: true })
  aid: number;
}

export class GetCommentsOutput {
  @ApiProperty({ description: 'result' })
  result: Comment[];
}
