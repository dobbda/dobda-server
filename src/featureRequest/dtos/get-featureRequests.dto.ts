import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetFeatureRequestsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '제목', required: false })
  title: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '태그 id', required: false })
  tagId: number;
}
