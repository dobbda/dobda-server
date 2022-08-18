import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateTagsDto } from 'src/questions/dtos/create-question.dto';

export class CreateOutSourcingDto extends CreateTagsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목' })
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '코인' })
  readonly coin: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: '마감일' })
  readonly deadline: Date;
}
