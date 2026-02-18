import { Resolver } from '@nestjs/graphql';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}
}
