import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreatePortfolio {
  content?: any;
  card?: any;
  public?: boolean;
  skill?: string[];
  workField?: string[];
  job?: string;
}
