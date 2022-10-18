import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEnquiryDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '외주 Id' })
  readonly oid: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용' })
  readonly content: string;
}
