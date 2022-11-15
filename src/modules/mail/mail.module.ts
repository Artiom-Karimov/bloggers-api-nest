import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import * as config from '../../config/email';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: config.user,
          pass: config.pass,
        },
      },

      defaults: {
        from: config.senderName,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
