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
import { Member, Members } from '../../libs/dto/member/member';
import {
  LoginInput,
  MemberInput,
  MembersInquiry,
  SellersInquiry,
} from '../../libs/dto/member/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';

import { T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupAuthMemberLiked } from '../../libs/config';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    private viewService: ViewService,
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
    console.log('memberId in getMember:', memberId);

    const search: T = {
      _id: targetId,
      memberStatus: {
        $in: [MemberStatus.ACTIVE, MemberStatus.INACTIVE, MemberStatus.BLOCKED],
      },
    };
    const targetMember = await this.memberModel.findOne(search).exec();
    if (!targetMember) throw new NotFoundException(Message.NO_DATA_FOUND);
    if (memberId) {
      const viewIpnut: ViewInput = {
        memberId: memberId,
        viewRefId: targetId,
        viewGroup: ViewGroup.MEMBER,
      };
      const newView = await this.viewService.recordView(viewIpnut);
      if (newView) {
        await this.memberModel
          .findOneAndUpdate(search, { $inc: { memberViews: 1 } }, { new: true })
          .exec();
        targetMember.memberViews++;
      }
    }
    return targetMember;
  }

  public async getAllMembersByAdmin(input: MembersInquiry): Promise<Members> {
    const { text, memberStatus, memberType } = input.search;
    const match: T = {};
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (memberStatus) match.memberStatus = memberStatus;
    if (memberType) match.memberType = memberType;
    if (text) match.memberNick = { $regex: new RegExp(text, 'i') };

    const result = await this.memberModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    console.log('result', result);
    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }

  public async getSellers(
    memberId: ObjectId,
    input: SellersInquiry,
  ): Promise<Members> {
    const { text } = input.search ?? {};
    const match: T = {
      memberType: MemberType.SELLER,
      memberStatus: MemberStatus.ACTIVE,
    };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };
    if (text) match.memberNick = { $regex: new RegExp(text, 'i') };

    const result = await this.memberModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupAuthMemberLiked(memberId),
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    console.log('result', result);
    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }
}
