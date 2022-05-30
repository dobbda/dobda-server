import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTagsDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  names: string[];
}
