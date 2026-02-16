import { ObjectId } from 'bson';
export const availableSellersSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
  'memberRank',
];
export const availableMemberSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
];

export const availableProductSorts = [
  'createdAt',
  'updatedAt',
  'productLikes',
  'productViews',
  'productRank',
  'productPrice',
];

export const availableSellerSorts = [
  'createdAt',
  'updatedAt',
  'memberLikes',
  'memberViews',
  'memberRank',
];

export const availableCommentSorts = ['createdAt', 'updatedAt'];

// IMAGE CONFIGURATION (config.js)
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';
import { pipeline } from 'stream';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
  const ext = path.parse(filename).ext;
  return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupAuthMemberLiked = (
  memberId: T,
  targetRefId: string = '$_id',
) => {
  return {
    $lookup: {
      from: 'likes',
      let: {
        localField: targetRefId,
        localMemberId: memberId,
        localMyFavorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$likeRefId', '$$localField'] }, // compare field to localField
                { $eq: ['$memberId', '$$localMemberId'] }, // compare field to localMemberId
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            memberId: 1,
            likeRefId: 1,
            myFavorite: '$$localMyFavorite', // ✅ use $$ for variable
          },
        },
      ],
      as: 'meLiked',
    },
  };
};
interface LookupAuthMemberFollowed {
  followerId: T;
  followingId: string;
}
export const lookupAuthMemberFollowed = (input: LookupAuthMemberFollowed) => {
  const { followerId, followingId } = input;

  return {
    $lookup: {
      from: 'follows',
      let: {
        localFollowerId: followerId, // must match $$localFollowerId
        localFollowingId: followingId, // must match $$localFollowingId
        localMyFollowing: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$followerId', '$$localFollowerId'] },
                { $eq: ['$followingId', '$$localFollowingId'] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0, //aslida default keladi
            followerId: 1,
            followingId: 1,
            myFollowing: '$$localMyFollowing', // ✅ correct variable reference
          },
        },
      ],
      as: 'meFollowed',
    },
  };
};

export const lookupMember = {
  $lookup: {
    from: 'members',
    localField: 'memberId', //product.memberId
    foreignField: '_id', //_id =>
    as: 'memberData',
  },
};

export const lookupFollowingData = {
  $lookup: {
    from: 'members',
    localField: 'followingId',
    foreignField: '_id',
    as: 'followingData',
  },
};

export const lookupFollowerData = {
  $lookup: {
    from: 'members',
    localField: 'followerId',
    foreignField: '_id',
    as: 'followerData',
  },
};

export const lookupFavorite = {
  $lookup: {
    from: 'members',
    localField: 'favoriteProduct.memberId',
    foreignField: '_id',
    as: 'favoriteProduct.memberData',
  },
};

export const lookupVisit = {
  $lookup: {
    from: 'members',
    localField: 'visitedProduct.memberId',
    foreignField: '_id',
    as: 'visitedProduct.memberData',
  },
};
