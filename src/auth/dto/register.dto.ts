import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber(null)
  phone: string;

  @IsString()
  password: string;
}
