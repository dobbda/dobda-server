import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({ description: 'accessToken' })
  accessToken: string;

	@ApiProperty({ description: 'accessToken 만료시간' })
  accessExpires: number;


  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;

	@ApiProperty({ description: 'refreshToken 만료시간' })
  refreshExpires: number;
}
