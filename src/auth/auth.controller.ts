import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  Query,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginResponse } from './interfaces/login-response.interface';
import { User } from 'src/common/decorators/get-user.decorator';
import { UserResponse } from './interfaces/user-response.interface';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { ResetPasswordInput } from './dto/reset-password.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('check-token')
  async checkToken(@User() user: UserResponse): Promise<LoginResponse> {
    // const user = req['user'] as User;
    const token = await this.authService.getToken(user);
    return {
      user,
      token,
    };
  }
  @HttpCode(HttpStatus.OK)
  @Post('restore-password')
  async restorePassword(@Body() restorePassword: RestorePasswordDto) {
    return this.authService.restorePassword(restorePassword);
  }
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordInput: ResetPasswordInput) {
    return this.authService.resetPassword(resetPasswordInput);
  }
  @HttpCode(HttpStatus.OK)
  @Get('validate-token-reset-password')
  async validateTokenResetPassword(@Query('token') token: string) {
    return this.authService.validateTokenResetPassword(token);
  }
  @HttpCode(HttpStatus.OK)
  @Get('encrypt/:password')
  async encryptPassword(@Param('password') plainPassword: string) {
    return this.authService.encryptPassword(plainPassword);
  }
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async registerUser(@Body() registerDto: RegisterAuthDto) {
    return this.authService.registerUser(registerDto);
  }
}
