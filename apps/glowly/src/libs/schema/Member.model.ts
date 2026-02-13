import { Schema } from 'mongoose';
import {
  MemberAuthType,
  MemberGender,
  MemberStatus,
  MemberType,
} from '../enums/member.enum';

//Schema first, Code first
const MemberSchema = new Schema(
  {
    //Define
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },
    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },
    memberAuthType: {
      type: String,
      enum: MemberAuthType,
      default: MemberAuthType.PHONE,
    },
    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },
    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },
    memberPassword: {
      type: String,
      select: false,
      required: true,
    },
    memberFullName: { type: String },
    memberAddress: { type: String },

    memberDesc: {
      type: String,
    },
    // ✅ Add Gender field
    memberGender: {
      type: String,
      enum: MemberGender,
      required: false,
    },
    memberImage: {
      type: String,
      default: '',
    },
    memberProducts: { type: Number, default: 0 },
    memberArticles: { type: Number, default: 0 },
    memberFollowers: { type: Number, default: 0 },
    memberFollowings: { type: Number, default: 0 },
    memberPoints: {
      type: Number,
      default: 0,
    },
    memberLikes: { type: Number, default: 0 },
    memberViews: { type: Number, default: 0 },
    memberComments: { type: Number, default: 0 },
    memberRank: { type: Number, default: 0 },
    memberWarnings: { type: Number, default: 0 },

    memberBlocks: { type: Number, default: 0 },
    deletedAt: { type: Date },
  },
  { timestamps: true, collection: 'members' }, //updatedAt, createdAt
);

export default MemberSchema;
