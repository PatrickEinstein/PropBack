import { IsOptional, IsString } from 'class-validator';
import { FetchFundingDto } from './fetch-funding.dto';

export class FetchFundingHistoryDto extends FetchFundingDto {
  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  founder?: string;
}
