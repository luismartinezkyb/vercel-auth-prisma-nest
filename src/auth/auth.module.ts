import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from 'src/common/services/mail/mail.module';
// import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    JwtModule.register({}),
    // EmailModule,
    MailModule,
  ],
})
export class AuthModule {}
