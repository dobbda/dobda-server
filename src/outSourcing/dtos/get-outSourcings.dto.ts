import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetOutSourcingsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '태그', required: false })
  keyword: string;
}
