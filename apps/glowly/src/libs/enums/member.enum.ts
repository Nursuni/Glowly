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
  APPLE = 'APPLE',
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
});
