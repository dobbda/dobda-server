import { User } from 'src/users/entities/user.entity';
import { PickType } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UserUpdateDTO  { //소셜가입시 필요한 주요 정보, 
	@IsOptional()
  @IsString()
  name?:string

	@IsOptional()
  @IsString()
  nickname?:string

  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  skill: string[];

	@IsOptional()
  @IsString()
  avatar?:string

  @IsOptional()
  @IsString()
  description?:string
}
