import { IsString } from 'class-validator';

export class SocialCodeDto {
  @IsString()
  readonly code: string;
}
