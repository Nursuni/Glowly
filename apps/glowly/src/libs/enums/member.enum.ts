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
}
registerEnumType(MemberAuthType, { name: 'MemberAuthType' });
