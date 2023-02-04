import { IsIn, IsOptional, IsString } from 'class-validator';
import { FetchQueryDto } from '../../common/fetch-query.dto';
import { PortfolioItemStatus } from '../schema/portfolio-item.schema';

export class FetchPortfolioDto extends FetchQueryDto {
  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsString()
  founder?: string;

  @IsIn(['active', 'sold', 'pending', 'failed'])
  @IsOptional()
  @IsString()
  status?: PortfolioItemStatus;
}
