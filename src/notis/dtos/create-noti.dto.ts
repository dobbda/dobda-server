import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateNotiDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly title: string;

  @IsUrl()
  @ApiProperty({ description: '내용' })
  readonly link?: string;
}
