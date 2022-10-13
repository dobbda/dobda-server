import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateNotiDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ description: '메인 여부' })
  readonly main: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly title: string;

  @IsString()
  @ApiProperty({ description: '내용' })
  readonly image: string;
}
