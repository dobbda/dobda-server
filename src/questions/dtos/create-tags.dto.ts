import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagsDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  names: string[];
}
