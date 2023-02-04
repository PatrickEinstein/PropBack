import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../../user/schema/user.schema';

export class UserSigninDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['funder', 'admin'])
  type: UserType;
}
