import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from './quiz.service';
import {
  QuizSubmission,
  QuizSubmissionSchema,
} from '../../libs/schema/Quiz.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizSubmission.name, schema: QuizSubmissionSchema },
    ]),
  ],
  providers: [QuizResolver, QuizService],
})
export class QuizModule {}
