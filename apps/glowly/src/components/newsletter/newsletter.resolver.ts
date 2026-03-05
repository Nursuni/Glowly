import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { NewsletterService } from './newsletter.service';
import { Newsletter } from '../../libs/dto/newsletter/newsletter';

@Resolver()
export class NewsletterResolver {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Mutation(() => Newsletter)
  async subscribeNewsletter(@Args('email') email: string): Promise<Newsletter> {
    const result = await this.newsletterService.subscribe(email);

    const obj = result.toObject();

    return {
      _id: obj._id.toString(),
      email: obj.email,
      createdAt: obj.createdAt,
    };
  }
}
