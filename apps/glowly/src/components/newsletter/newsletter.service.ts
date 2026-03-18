import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsletterDocument } from '../../libs/schema/NewsLetter.model';
import { MailerService } from '@nestjs-modules/mailer'; // 1. Import this

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel('Newsletter')
    private newsletterModel: Model<NewsletterDocument>,
    private readonly mailerService: MailerService, // 2. Inject this
  ) {}

  async subscribe(email: string): Promise<NewsletterDocument> {
    // Check if exists first to avoid duplicates
    const exists = await this.newsletterModel.findOne({ email });
    if (exists) throw new Error('Already subscribed!');

    const newSub = await this.newsletterModel.create({ email });

    // 3. This now actually triggers the delivery process
    await this.sendWelcomeEmail(email);

    return newSub;
  }

  private async sendWelcomeEmail(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to the Glowly Family! ✨ (10% Off Inside)',
      // You can use a template file or raw HTML:
      html: `
      <div style="font-family: 'Helvetica', sans-serif; color: #4A4A4A; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px;">
        <h1 style="color: #2D2D2D; text-align: center; font-weight: 300;">Welcome to Glowly, Beautiful.</h1>
        <p style="text-align: center; font-size: 16px; line-height: 1.6;">
          Thank you for joining our community. We are so excited to help you discover the finest Korean skincare and rituals for your unique glow.
        </p>
        
        <div style="background-color: #FAF9F6; padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px;">
          <p style="margin: 0; text-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Welcome Gift</p>
          <h2 style="margin: 10px 0; color: #8E735B;">10% OFF</h2>
          <p style="margin-bottom: 20px;">Use code: <b>GLOW10</b> at checkout</p>
          <a href="https://glowly.com" style="background-color: #2D2D2D; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-size: 14px;">Shop K-Beauty</a>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;">
        
        <p style="font-size: 12px; color: #999; text-align: center;">
          🚚 Free shipping on orders over ₩80,000<br>
          📍 Seoul, South Korea · Worldwide Delivery<br><br>
          © 2026 Glowly Cosmetics. All Rights Reserved.
        </p>
      </div>
    `,
    });
  }
}
