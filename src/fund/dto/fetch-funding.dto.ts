import { IsIn, IsOptional, IsString } from 'class-validator';
import { FetchQueryDto } from '../../common/fetch-query.dto';
import { FundTransactionStatus } from '../schema/fund-transaction.schema';

export class FetchFundingDto extends FetchQueryDto {
  @IsIn(['approved', 'rejected', 'pending'])
  @IsString()
  @IsOptional()
  status?: FundTransactionStatus;
}
