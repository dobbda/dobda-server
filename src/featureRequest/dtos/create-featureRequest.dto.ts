import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';

export class CreateFeatureRequestDto extends CreateTagsDto {
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
