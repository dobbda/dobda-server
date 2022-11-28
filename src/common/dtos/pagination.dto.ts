import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'page', default: 1, required: false })
  page: number = 1;
}

export class PaginationOuput {
  totalPages: number;
  total?: number;
}
