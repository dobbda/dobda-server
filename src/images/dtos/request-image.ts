import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '파일 이름' })
  readonly filename: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '파일 확장자' })
  readonly extension: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '파일 크기' })
  readonly filesize: number;
}
