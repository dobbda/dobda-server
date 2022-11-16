import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreatePortfolio {
  @IsString()
  content: string;

  @IsString()
  card: string;

  @IsBoolean()
  public: boolean;
}
