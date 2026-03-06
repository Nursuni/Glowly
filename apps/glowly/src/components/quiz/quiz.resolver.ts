import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import {
  SubmitQuizInput,
  QuestionsResponseGql,
  QuizResultGql,
  QuizQuestionGql,
} from '../../libs/dto/quiz/quiz.types';
import { QUESTIONS } from '../../libs/quiz.constants';

@Resolver()
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  @Query(() => QuestionsResponseGql, { name: 'quizQuestions' })
  getQuestions(): QuestionsResponseGql {
    return {
      totalSteps: QUESTIONS.length,
      questions: QUESTIONS as unknown as QuizQuestionGql[],
    };
  }

  @Mutation(() => QuizResultGql, { name: 'submitQuiz' })
  async submitQuiz(
    @Args('input') input: SubmitQuizInput,
  ): Promise<QuizResultGql> {
    return this.quizService.analyzeResults(input);
  }
}