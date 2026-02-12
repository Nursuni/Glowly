import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  //   @Mutation(() => Member)
  //   public async signup(@Args('input') input: MemberInput): Promise<Member> {
  //     console.log('Mutation: signup');
  //     console.log('input', input);
  //     return await this.memberService.signup(input);
  //   }
}
