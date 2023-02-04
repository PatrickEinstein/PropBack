import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateFunderDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(14)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
