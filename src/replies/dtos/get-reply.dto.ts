import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Reply } from '../entities/reply.entity';

export class GetReplyDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'requiryId', required: true })
  enquiryId: number;
}

export class GetReplyOutput {
  @ApiProperty({ description: 'result' })
  result: Reply[];
}
