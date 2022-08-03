import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SendCoinDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'value', required: true })
  value: number;

  @Type(() => String)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'target', required: true })
  target: string;
}

export class SendCoinOutput {
  @ApiProperty({ description: 'success' })
  success: number;

  @ApiProperty({ description: 'message' })
  message?: string;
}
