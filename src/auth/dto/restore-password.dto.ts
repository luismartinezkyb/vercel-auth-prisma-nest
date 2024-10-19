import { IsEmail, IsString } from 'class-validator';

export class RestorePasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}
