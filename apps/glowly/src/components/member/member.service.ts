import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    private authService: AuthService,
  ) {}
  public async signup(input: MemberInput): Promise<Member> {
    try {
      //database dto error ni handle qilish uchun
      input.memberPassword = await this.authService.hashPassword(
        input.memberPassword,
      );
      const result = await this.memberModel.create(input);
      //TODO: AUTEHTICATION VIA TOKEN
      result.accessToken = await this.authService.createToken(result);
      return result;
    } catch (err) {
      console.log('err Service model', err.message);
      throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const { memberNick, memberPassword } = input;
    const response = await this.memberModel
      .findOne({ memberNick: memberNick })
      .select('+memberPassword')
      .exec();
    if (!response || response.memberStatus === MemberStatus.DELETED) {
      throw new UnauthorizedException(Message.NO_MEMBER_NICK);
    } else if (response.memberStatus === MemberStatus.BLOCKED)
      throw new InternalServerErrorException(Message.BLOCKED_USER);

    if (!response.memberPassword) {
      throw new InternalServerErrorException('Password missing');
    }
    //TODO: Compare passwords
    const isMatch = await this.authService.comparePasswords(
      memberPassword,
      response.memberPassword,
    );

    if (!isMatch)
      throw new InternalServerErrorException(Message.WRONG_PASSWORD);
    response.accessToken = await this.authService.createToken(response);
    return response;
  }
}
