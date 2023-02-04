import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FetchQueryDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  count?: number;

  @IsString()
  @IsOptional()
  populate?: string;

  @IsString()
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;
}
