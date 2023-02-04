import { IsOptional, IsString } from 'class-validator';
import { FetchQueryDto } from '../../common/fetch-query.dto';
import { ProjectStatus } from '../schema/project.schema';

export class FetchProjectsDto extends FetchQueryDto {
  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  status?: ProjectStatus;
}
