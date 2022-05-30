import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
