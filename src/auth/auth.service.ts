import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PayloadUser } from './interfaces/payload-user.interface';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { ResponseCode, ResponseMessage } from 'src/common/enums/errors.enum';
import { MailService } from 'src/common/services/mail/mail.service';
import { ResetPasswordInput } from './dto/reset-password.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
// import { EmailResetPasswordData } from 'src/common/services/interfaces/email-reset-password.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const findUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        password: true,
        email: true,
        isActive: true,
      },
    });
    if (!findUser) throw new NotFoundException('User not found');

    const checkPassword = await compare(password, findUser.password);

    if (!checkPassword) throw new ForbiddenException('Password is invalid');

    const token = await this.getToken({
      id: findUser.id,
      email: findUser.email,
      isActive: findUser.isActive,
      name: findUser.name,
    });
    delete findUser.password;
    return {
      user: findUser,
      token,
    };
  }

  async getToken(payload: PayloadUser): Promise<string> {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
    return token;
  }

  async restorePassword(restorePassword: RestorePasswordDto) {
    try {
      const { email } = restorePassword;
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
      if (!user)
        throw new NotFoundException(
          `User ${ResponseMessage[ResponseCode.RECORD_NOT_FOUND]}`,
        );
      const payload = {
        email: user.email,
      };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_TEMPORAL_JWT'),
        expiresIn: this.configService.get<string>('EMAIL_EXPIRATION'),
      });
      //TODO: Uncomment this to send a mail notification
      // const url = `${this.configService.get<string>('FRONTEND_URL')}auth/reset-password/${token}`;
      // const dynamicTemplateData: EmailResetPasswordData = {
      //   url,
      //   urlImage: '',
      //   userEmail: user.name,
      //   urlFacebook: 'https://www.facebook.com/',
      //   urlTwitter: 'https://x.com/',
      //   urlInstagram: 'https://www.instagram.com/',
      //   urlLinkedin: 'https://www.linkedin.com/',
      //   addressCompany: 'George St. 122',
      //   numberCompany: '+111 111 1111',
      //   companyEmail: 'email@example.com',
      //   nameCompany: 'BookMyTatto',
      // };
      // const from = this.configService.get<string>('SENDGRID_SENDER');
      // await this.mailService.sendEmail({
      //   to: user.email,
      //   from,
      //   templateId: sendgridTemplates.RESTORE_PASSWORD,
      //   dynamicTemplateData,
      // });
      return {
        status: 'OK',
        message: 'Mail sent successfully',
      };
    } catch (error) {
      console.log({ error });
      if (error.response && error.response.body)
        throw new BadRequestException(`Something went wrong sending email.`);
      if (error.status === 404)
        throw new NotFoundException(
          `User ${ResponseMessage[ResponseCode.RECORD_NOT_FOUND]}`,
        );
      throw new Error('Something went wrong');
    }
  }

  async resetPassword(body: ResetPasswordInput) {
    try {
      const { token, password, confirmPassword } = body;
      if (password !== confirmPassword)
        throw new ConflictException('PASSWORD_MISMATCH');
      const plainToHash = await hash(password, 10);
      const { email } = await this.validateToken(token);
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) throw new NotFoundException('USER_NOT_FOUND');
      await this.prismaService.user.update({
        where: { email },
        data: {
          password: plainToHash,
        },
      });
      await this.prismaService.blackListTokens.create({
        data: {
          token,
          userId: user.id,
        },
      });
      return {
        status: 0,
        message: 'Password updated successfully',
      };
    } catch (error) {
      console.log({ error });
      if (error.message === 'TOKEN_INVALID')
        throw new ConflictException('Token invalid');
      if (error.message === 'TOKEN_ALREADY_USED')
        throw new ConflictException('Token already used');
      if (error.message === 'PASSWORD_MISMATCH')
        throw new ConflictException('Password mismatch');
      if (error.message === 'USER_NOT_FOUND')
        throw new NotFoundException('User not Found');
      throw new BadRequestException(error.message);
    }
  }

  async validateTokenResetPassword(token: string) {
    try {
      const validToken = await this.validateToken(token);
      return {
        status: 0,
        email: validToken.email,
      };
    } catch (error) {
      console.log({ error });
      if (error.message === 'TOKEN_INVALID')
        throw new ConflictException('Invalid Token');
      if (error.message === 'TOKEN_ALREADY_USED')
        throw new ConflictException('Token already used');
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Validate if the token is a valid JWT and if it has not expired or been used before.
   * @param token String containing jwt user token
   * @returns an object containing the email of the user or an error
   */
  private async validateToken(token: string): Promise<{ email: string }> {
    try {
      const tokenIsValid = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_TEMPORAL_JWT'),
        ignoreExpiration: false,
      });
      if (!tokenIsValid) throw new BadRequestException('TOKEN_INVALID');
      const payload = this.jwtService.decode<User>(token);
      const tokenHasBeenUsed =
        await this.prismaService.blackListTokens.findUnique({
          where: {
            token,
          },
        });
      if (tokenHasBeenUsed) throw new BadRequestException('TOKEN_ALREADY_USED');
      return {
        email: payload.email,
      };
    } catch (error) {
      console.log({ error });
      if (error.message === 'invalid signature')
        throw new ConflictException('INVALID_SIGNATURE_TOKEN');
      if (error.message === 'jwt expired')
        throw new ConflictException('TOKEN_EXPIRED');
      if (error.message === 'jwt malformed')
        throw new ConflictException('INVALID_JWT');
      if (error.message === 'TOKEN_ALREADY_USED')
        throw new ConflictException('TOKEN_ALREADY_USED');
      throw new BadRequestException('ERROR_VALIDATE_TOKEN');
    }
  }
  async encryptPassword(plainPassword: string) {
    const hashedPassword = await hash(plainPassword, 10);
    return {
      plainPassword,
      hashedPassword,
    };
  }

  async registerUser(body: RegisterAuthDto) {
    const { name, email, password, phone } = body;
    const userExists = await this.prismaService.user.count({
      where: {
        email,
      },
    });
    if (userExists === 1) throw new ConflictException('User already exists');
    // if(userExists)
    const plainToHash = await hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: plainToHash,
        phone,
        role: {
          create: {
            name: 'admin',
          },
        },
      },
    });
    delete user.password;
    return user;
  }
}
