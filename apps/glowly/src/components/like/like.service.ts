import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { Products } from '../../libs/dto/product/product';
import { lookupFavorite } from '../../libs/config';
import { LikeGroup } from '../../libs/enums/like.enum';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel('Like') private readonly likeModel: Model<Like>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  public async toggleLike(input: LikeInput): Promise<number> {
    const search: T = {
        memberId: input.memberId,
        likeRefId: input.likeRefId,
      },
      exist = await this.likeModel.findOne(search).exec();
    let modifier = 1;
    if (exist) {
      await this.likeModel.findOneAndDelete(search).exec();
      modifier = -1;
    } else {
      try {
        await this.likeModel.create(input);
      } catch (err) {
        console.log('Error Service.model:', err instanceof Error ? err.message : String(err));
        throw new BadRequestException(Message.CREATE_FAILED);
      }
    }
    if (input.likeGroup === LikeGroup.PRODUCT) {
      await this.cacheManager.del(`product:${input.likeRefId.toString()}`);
    }
    console.log(`Like modifer ${modifier} `);
    return modifier;
  }

  public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
    const { memberId, likeRefId } = input;
    const result = await this.likeModel
      .findOne({ memberId: memberId, likeRefId: likeRefId })
      .exec();
    return result
      ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }]
      : [];
  }

  public async getFavoriteProducts(
    memberId: ObjectId,
    input: OrdinaryInquiry,
  ): Promise<Products> {
    const { page, limit } = input;
    const match: T = { likeGroup: LikeGroup.PRODUCT, memberId: memberId };

    const data: T = await this.likeModel
      .aggregate([
        { $match: match },
        { $sort: { updatedAt: -1 } }, //newest => oldest
        {
          $lookup: {
            from: 'products',
            localField: 'likeRefId',
            foreignField: '_id',
            as: 'favoriteProduct',
          },
        },
        { $unwind: '$favoriteProduct' }, //Converts array into an object
        {
          $facet: {
            //two results in one DB call.
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupFavorite,
              { $unwind: '$favoriteProduct.memberData' }, //Converts array into an object
            ],
            metaCounter: [{ $count: 'total' }], //5=> Total: 5
          },
        },
      ])
      .exec();

    console.log('data:', data);

    const result: Products = { list: [], metaCounter: data[0].metaCounter };
    result.list = data[0].list.map((ele) => ele.favoriteProduct);
    console.log('data:', result);

    return result;
  }
}
