import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}
registerEnumType(MemberType, { name: 'MemberType' });

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}
registerEnumType(MemberStatus, { name: 'MemberStatus' });

export enum MemberAuthType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM',
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  APPLE = 'APPLE', // iOS users
}
registerEnumType(MemberAuthType, { name: 'MemberAuthType' });

export enum MemberGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

registerEnumType(MemberGender, {
  name: 'MemberGender',
  description: 'Gender of the member (optional)',
});

export enum MembershipTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

registerEnumType(MembershipTier, {
  name: 'MembershipTier',
  description: 'Membership tier level for rewards and benefits',
  valuesMap: {
    BRONZE: { description: 'Entry level - 0-999 points' },
    SILVER: { description: 'Silver level - 1,000-4,999 points' },
    GOLD: { description: 'Gold level - 5,000-9,999 points' },
    PLATINUM: { description: 'Platinum level - 10,000-19,999 points' },
    DIAMOND: { description: 'Diamond level - 20,000+ points' },
  },
});
