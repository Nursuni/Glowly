import { ObjectType, Field, Int, InputType, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

// ── Input ──────────────────────────────────────────────

@InputType()
export class SubmitQuizInput {
  @Field(() => GraphQLJSON, {
    description: 'Map of questionId → skinValue e.g. { q1: "oily" }',
  })
  answers: Record<string, string>;
}

// ── Question ───────────────────────────────────────────

@ObjectType()
export class QuizOptionGql {
  @Field() letter: string;
  @Field() text: string;
  @Field() skinValue: string;
}

@ObjectType()
export class QuizQuestionGql {
  @Field(() => ID) id: string;
  @Field(() => Int) step: number;
  @Field() category: string;
  @Field() question: string;
  @Field() emoji: string;
  @Field(() => [QuizOptionGql]) options: QuizOptionGql[];
}

@ObjectType()
export class QuestionsResponseGql {
  @Field(() => Int) totalSteps: number;
  @Field(() => [QuizQuestionGql]) questions: QuizQuestionGql[];
}

// ── Result ─────────────────────────────────────────────

@ObjectType()
export class RecommendationsGql {
  @Field() cleanser: string;
  @Field() moisturizer: string;
  @Field() spf: string;
  @Field() treatment: string;
}

@ObjectType()
export class IngredientsGql {
  @Field(() => [String]) embrace: string[];
  @Field(() => [String]) avoid: string[];
}

@ObjectType()
export class BreakdownEntryGql {
  @Field() skinType: string;
  @Field(() => Int) percentage: number;
}

@ObjectType()
export class QuizResultGql {
  @Field() skinType: string;
  @Field() emoji: string;
  @Field() tagline: string;
  @Field() description: string;
  @Field(() => [String]) traits: string[];
  @Field(() => [String]) routine: string[];
  @Field(() => RecommendationsGql) recommendations: RecommendationsGql;
  @Field(() => IngredientsGql) ingredients: IngredientsGql;
  @Field(() => [BreakdownEntryGql]) breakdown: BreakdownEntryGql[];
  @Field(() => Int) answeredQuestions: number;
}
