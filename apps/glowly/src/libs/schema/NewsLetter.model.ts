import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterDocument = NewsletterSchemaClass & Document;

@Schema({ timestamps: true })
export class NewsletterSchemaClass {
  @Prop({ required: true, unique: true })
  email: string;
}

export const NewsletterSchema = SchemaFactory.createForClass(
  NewsletterSchemaClass,
);
