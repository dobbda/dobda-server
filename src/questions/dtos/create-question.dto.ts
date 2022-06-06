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
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsOptional()
  @IsNumber()
  readonly coin: number;
}

export class CreateTagsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tagNames: string[];
}
