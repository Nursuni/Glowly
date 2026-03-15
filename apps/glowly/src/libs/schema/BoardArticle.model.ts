import { Schema } from 'mongoose';
import {
  BoardArticleCategory,
  BoardArticlePriority,
  BoardArticleReportReason,
  BoardArticleStatus,
} from '../enums/board-article.enum';

const BoardArticleSchema = new Schema(
  {
    articleCategory: {
      type: String,
      enum: Object.values(BoardArticleCategory),
      required: true,
    },

    articleStatus: {
      type: String,
      enum: BoardArticleStatus,
      default: BoardArticleStatus.ACTIVE,
    },

    articleTitle: {
      type: String,
      required: true,
    },

    articleContent: {
      type: String,
      required: true,
    },

    articleImage: {
      type: String,
    },

    articleLikes: {
      type: Number,
      default: 0,
    },

    articleViews: {
      type: Number,
      default: 0,
    },

    articleComments: {
      type: Number,
      default: 0,
    },

    articleReportCount: {
      type: Number,
      default: 0,
    },

    articleTags: {
      type: [String],
      default: [],
      index: true,
    },

    articlePriority: {
      type: String,
      enum: BoardArticlePriority,
      default: BoardArticlePriority.NORMAL,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },

    articleReports: [
      {
        memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
        reason: { type: String, enum: BoardArticleReportReason },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: 'boardArticles' },
);

export default BoardArticleSchema;
