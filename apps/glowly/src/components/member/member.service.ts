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
  BrandsInquiry,
} from '../../libs/dto/member/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';

import { StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupAuthMemberLiked } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeService } from '../like/like.service';
import { LikeGroup } from '../../libs/enums/like.enum';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    private viewService: ViewService,
    private authService: AuthService,
    private likeService: LikeService,
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
    const { text, memberStatus, memberType } = input.search ?? {};
    const match: T = {};
    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
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

  public async getBrands(
    memberId: ObjectId,
    input: BrandsInquiry,
  ): Promise<Members> {
    const text = input.search?.text;
    const match: T = {
      memberType: MemberType.BRAND,
      memberStatus: MemberStatus.ACTIVE,
    };
    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
    };
    if (text) {
      match.memberNick = { $regex: text, $options: 'i' };
    }

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

  public async updateMemberByAdmin(input: MemberUpdate): Promise<Member> {
    const result = await this.memberModel
      .findOneAndUpdate({ _id: input._id }, input, { new: true })
      .exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }

  public async memberStatsEditor(input: StatisticModifier): Promise<Member> {
    console.log('Executed: memberStatsEditor', input);

    const { _id, targetKey, modifier } = input;

    return await this.memberModel
      .findOneAndUpdate(
        { _id },
        { $inc: { [targetKey]: modifier } },
        { new: true },
      )
      .exec();
  }

  public async likeTargetMember(
    memberId: ObjectId,
    likeRefId: ObjectId,
  ): Promise<Member> {
    const target: Member = await this.memberModel
      .findOne({ _id: likeRefId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const input: LikeInput = {
      memberId: memberId,
      likeRefId: likeRefId,
      likeGroup: LikeGroup.MEMBER,
    };

    const modifier: number = await this.likeService.toggleLike(input);
    const result = await this.memberStatsEditor({
      _id: likeRefId,
      targetKey: 'memberLikes',
      modifier: modifier,
    });

    if (!result)
      throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    return result;
    // LIKE TOGGLE
  }
}
