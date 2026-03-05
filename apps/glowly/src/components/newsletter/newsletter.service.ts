import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsletterDocument } from '../../libs/schema/NewsLetter.model';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel('Newsletter')
    private newsletterModel: Model<NewsletterDocument>,
  ) {}

  async subscribe(email: string): Promise<NewsletterDocument> {
    const exists = await this.newsletterModel.findOne({ email });

    if (exists) {
      throw new Error('Email already subscribed');
    }

    return await this.newsletterModel.create({ email });
  }
}
