import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { Enquiry } from '../entities/enquiry.entity';

export class GetEnquiryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'outSourcingId', required: false })
  oid: number;
}

export class GetEnquiryOutput {
  @ApiProperty({ description: 'result' })
  result: Enquiry[];
}
