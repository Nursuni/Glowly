import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NewsletterResolver } from './newsletter.resolver';
import { NewsletterService } from './newsletter.service';
import { NewsletterSchema } from '../../libs/schema/NewsLetter.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Newsletter', schema: NewsletterSchema },
    ]),
  ],
  providers: [NewsletterResolver, NewsletterService],
})
export class NewsletterModule {}
