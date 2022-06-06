import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetQuestionsDto {
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  tag: string;
}
