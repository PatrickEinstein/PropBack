import { IsNotEmpty, IsNumber } from 'class-validator';

export class FundProjectDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
