import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetFeatureRequestsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  title: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  tagId: number;
}
