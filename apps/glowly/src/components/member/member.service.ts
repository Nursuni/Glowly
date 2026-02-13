import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { Follower, Following } from '../../libs/dto/follow/follow';
import { T } from '../../libs/types/common';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,

    private authService: AuthService,
  ) {}
  public async signup(input: MemberInput): Promise<Member> {
    try {
      input.memberPassword = await this.authService.hashPassword(
        input.memberPassword,
      );
      const result = await this.memberModel.create(input);

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
      throw new ForbiddenException(Message.BLOCKED_USER);

    if (!response.memberPassword) {
      throw new InternalServerErrorException('Password missing');
    }
    //TODO: Compare passwords
    const isMatch = await this.authService.comparePasswords(
      memberPassword,
      response.memberPassword,
    );

    if (!isMatch) throw new UnauthorizedException(Message.WRONG_PASSWORD);
    response.accessToken = await this.authService.createToken(response);
    return response;
  }

  public async updateMember(
    memberId: ObjectId,
    input: MemberUpdate,
  ): Promise<Member> {
    if (input.memberPassword) {
      input.memberPassword = await this.authService.hashPassword(
        input.memberPassword,
      );
    }
    const result = await this.memberModel
      .findOneAndUpdate(
        { _id: memberId, memberStatus: MemberStatus.ACTIVE },
        input,
        { new: true },
      )
      .exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    result.accessToken = await this.authService.createToken(result);

    return result;
  }

  public async getMember(
    memberId: ObjectId,
    targetId: ObjectId,
  ): Promise<Member> {
    const search: T = {
      _id: targetId,
      memberStatus: { $in: [MemberStatus.ACTIVE, MemberStatus.BLOCKED] },
    };
    const targetMember = await this.memberModel.findOne(search).exec();
    if (!targetMember) throw new NotFoundException(Message.NO_DATA_FOUND);

    return targetMember;
  }
}
