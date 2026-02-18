import { Resolver } from '@nestjs/graphql';

@Resolver()
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}
}
