import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsNumber()
  @IsNotEmpty()
  fundingTarget: number;

  @IsNumber()
  @IsNotEmpty()
  sharePercentage: number;

  @IsNumber()
  @IsNotEmpty()
  fundingTenure: number;

  @IsNumber()
  @IsNotEmpty()
  maturityPeriod: number;

  @IsString()
  @IsNotEmpty()
  imageKey: string;
}
