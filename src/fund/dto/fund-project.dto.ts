import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FundProjectDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
