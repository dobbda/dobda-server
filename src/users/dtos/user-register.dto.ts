import { User } from 'src/users/entities/user.entity';
import { PickType } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UserRegisterDTO {
  //소셜가입시 필요한 주요 정보,
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  nickname: string;

  @IsString()
  avatar: string;

  description?: string;

  sign?: string;
}
