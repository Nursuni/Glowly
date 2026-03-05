import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SubmitQuizInput, QuizResultGql } from '../../libs/dto/quiz/quiz.types';
import { SKIN_RESULTS, SkinType } from '../../libs/quiz.constants';
import {
  QuizSubmission,
  QuizSubmissionDocument,
} from '../../libs/schema/Quiz.model';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(QuizSubmission.name)
    private readonly submissionModel: Model<QuizSubmissionDocument>,
  ) {}

  async analyzeResults(input: SubmitQuizInput): Promise<QuizResultGql> {
    const { answers } = input;

    const tally: Record<SkinType, number> = {
      dry: 0,
      normal: 0,
      oily: 0,
      combination: 0,
      sensitive: 0,
    };

    for (const value of Object.values(answers)) {
      if (value in tally) tally[value as SkinType]++;
    }

    const totalAnswered = Object.values(tally).reduce((a, b) => a + b, 0);
    const dominantType = Object.entries(tally).sort(
      (a, b) => b[1] - a[1],
    )[0][0] as SkinType;

    const result = SKIN_RESULTS[dominantType];
    if (!result)
      throw new NotFoundException(`Unknown skin type: ${dominantType}`);

    const breakdown = Object.entries(tally)
      .map(([skinType, count]) => ({
        skinType,
        percentage:
          totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    await this.submissionModel.create({
      skinType: dominantType,
      answers,
      breakdown,
    });

    return {
      skinType: dominantType,
      ...result,
      breakdown,
      answeredQuestions: totalAnswered,
    };
  }
}
