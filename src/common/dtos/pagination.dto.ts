import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  page: number = 1;
}

export class PaginationOuput {
  totalPages?: number;
}
