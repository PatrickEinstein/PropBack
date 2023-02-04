import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitKycDataDto {
  @IsString()
  @IsNotEmpty()
  identityType: string;

  @IsString()
  @IsNotEmpty()
  front: string;

  @IsString()
  @IsNotEmpty()
  back: string;
}
