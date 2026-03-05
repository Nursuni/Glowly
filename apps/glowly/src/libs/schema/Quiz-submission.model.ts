import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizSubmissionDocument = QuizSubmission & Document;

@Schema({ _id: false })
class BreakdownEntry {
  @Prop() skinType: string;
  @Prop() percentage: number;
}

@Schema({ timestamps: true, collection: 'quiz_submissions' })
export class QuizSubmission {
  @Prop({ required: true }) skinType: string;
  @Prop({ type: Object }) answers: Record<string, string>;
  @Prop({ type: [BreakdownEntry] }) breakdown: BreakdownEntry[];
}

export const QuizSubmissionSchema =
  SchemaFactory.createForClass(QuizSubmission);
