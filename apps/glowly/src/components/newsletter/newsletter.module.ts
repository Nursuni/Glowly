import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

import { NewsletterResolver } from './newsletter.resolver';
import { NewsletterService } from './newsletter.service';
import { NewsletterSchema } from '../../libs/schema/NewsLetter.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Newsletter', schema: NewsletterSchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"Glowly" <no-reply@glowly.com>',
      },
    }),
  ],
  providers: [NewsletterResolver, NewsletterService],
})
export class NewsletterModule {}
