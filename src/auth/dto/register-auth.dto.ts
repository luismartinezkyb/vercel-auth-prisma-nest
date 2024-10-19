import { IsNotEmpty, IsString } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  phone: string;
}
