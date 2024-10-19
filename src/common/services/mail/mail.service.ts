import { Injectable } from '@nestjs/common';
import { EmailData } from '../interfaces/email-data.interface';
// import { NodemailerService } from './nodemailer/nodemailer.service';
// import { SendgridService } from './sendgrid/sendgrid.service';
// import { MailDataRequired } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  //TODO: Inject Nodemailer and  sendgrid
  // constructor(
  //   private readonly sendgridService: SendgridService,
  //   private readonly nodemailerService: NodemailerService,
  //   private readonly configService: ConfigService,
  // ) {}

  // async sendEmail(args: MailDataRequired) {
  //   return await this.sendgridService.sendEmailSendgrid(args);
  // }
  // async sendEmailNodemailer(args: EmailData) {
  //   const from = 'Book my Tattoo <bookmytattoo@example.com>';
  //   await this.nodemailerService.sendEmailNodemailer({
  //     from,
  //     ...args,
  //   });
  // }
}
