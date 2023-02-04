import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateFounderDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  projectStage: string;

  @IsString()
  @IsNotEmpty()
  pitchDeck: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
