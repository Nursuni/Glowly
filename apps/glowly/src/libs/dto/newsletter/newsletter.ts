import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Newsletter {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}
