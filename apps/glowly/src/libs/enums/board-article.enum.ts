import { registerEnumType } from '@nestjs/graphql';

export enum BoardArticleCategory {
  FREE = 'FREE',
  RECOMMEND = 'RECOMMEND',
  NEWS = 'NEWS',
  QUESTION = 'QUESTION', // Q&A posts
  REVIEW = 'REVIEW', // Product reviews
  TUTORIAL = 'TUTORIAL', // How-to guides
  DISCUSSION = 'DISCUSSION', // General discussions
  ANNOUNCEMENT = 'ANNOUNCEMENT', // Official announcements
}
registerEnumType(BoardArticleCategory, {
  name: 'BoardArticleCategory',
});

export enum BoardArticleStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  HIDDEN = 'HIDDEN', // Hidden by admin
  REPORTED = 'REPORTED', // Flagged for review
}
registerEnumType(BoardArticleStatus, {
  name: 'BoardArticleStatus',
});
