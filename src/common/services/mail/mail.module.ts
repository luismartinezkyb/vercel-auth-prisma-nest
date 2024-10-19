import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { NodemailerService } from './nodemailer/nodemailer.service';
// import { SendgridService } from './sendgrid/sendgrid.service';

@Module({
  controllers: [],
  imports: [
    ConfigModule,
    // MailerModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     transport: {
    //       host: configService.get<string>('EMAIL_HOST'),
    //       port: configService.get<number>('EMAIL_PORT'),
    //       secure: true, //TODO: Disable this when prod
    //       auth: {
    //         user: configService.get<string>('EMAIL_USER'),
    //         pass: configService.get<string>('EMAIL_PASS'),
    //       },
    //     },
    //     // defaults: {
    //     //   from: '"nest-modules" <modules@nestjs.com>',
    //     // },
    //     // template: {
    //     //   dir: __dirname + '/templates',
    //     //   adapter: new HandlebarsAdapter(),
    //     //   options: {
    //     //     strict: true,
    //     //   },
    //     // },
    //   }),
    // }),
  ],
  providers: [MailService],
  exports: [MailService],
  // exports: [MailService, NodemailerService, SendgridService],
})
export class MailModule {}
