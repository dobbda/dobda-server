import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
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

  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @ApiProperty({ description: 'tagNames' })
  readonly tagNames: string[];
}

export class CreateTagsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @ApiProperty({ description: 'tagNames' })
  tagNames: string[];
}
