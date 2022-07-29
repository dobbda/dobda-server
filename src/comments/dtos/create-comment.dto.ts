import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '답변 아이디' })
  readonly answerId: number;
}
