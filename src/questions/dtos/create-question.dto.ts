import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTagsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @ApiProperty({ description: 'tagNames' })
  tagNames: string[];
}

export class CreateQuestionDto extends CreateTagsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목' })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '코인' })
  readonly coin: number;
}
