import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class CreatePortfolio {
  content?: any;
  card?: any;
  public?: boolean;
  skill?: string[];
  workField?: string[];
  job?: string;
}

export class OutPortfolioDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'keyword', required: false })
  keyword: string;
}
