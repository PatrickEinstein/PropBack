import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentAddressDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;
}
