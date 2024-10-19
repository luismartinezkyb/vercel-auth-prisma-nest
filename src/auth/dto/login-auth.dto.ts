import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  password: string;
}
