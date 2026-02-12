import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  HIDDEN = 'HIDDEN', // Hidden by moderator
  REPORTED = 'REPORTED', // Flagged for review
}
registerEnumType(CommentStatus, {
  name: 'CommentStatus',
});

export enum CommentGroup {
  MEMBER = 'MEMBER',
  ARTICLE = 'ARTICLE',
  PRODUCT = 'PRODUCT',
}
registerEnumType(CommentGroup, {
  name: 'CommentGroup',
});
