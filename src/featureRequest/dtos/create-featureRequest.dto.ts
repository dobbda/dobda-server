import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFeatureRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  readonly coin: number;

  @IsDateString()
  @IsNotEmpty()
  readonly deadline: Date;
}
