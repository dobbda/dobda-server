import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '질문 Id' })
  readonly qid: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;
}
