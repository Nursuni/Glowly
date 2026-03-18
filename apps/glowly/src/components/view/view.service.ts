import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';

import { lookupVisit } from '../../libs/config';
import { Products } from '../../libs/dto/product/product';
import { OrdinaryInquiry } from '../../libs/dto/product/product.input';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ViewService {
  constructor(
    @InjectModel('View') private readonly viewModel: Model<View>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async recordView(input: ViewInput): Promise<View | null> {
    const { memberId, viewRefId, viewGroup } = input;
    const cacheKey = `viewed:${memberId}:${viewRefId}`;

    const isRecentlyViewed = await this.cacheManager.get(cacheKey);
    if (isRecentlyViewed) return null;

    const viewExist = await this.checkViewExistence(input);
    if (!viewExist) {
      const newView = await this.viewModel.create(input);
      // 4. Store in Redis so next time we don't hit the DB
      // TTL of 24 hours (86400s) is standard for view countsgt
      await this.cacheManager.set(cacheKey, true, 86400);
      return newView;
    } else {
      // Also update Redis if it existed in DB but was missing from cache
      await this.cacheManager.set(cacheKey, true, 86400);
      return null;
    }
  }
  private async checkViewExistence(input: ViewInput): Promise<View | null> {
    const { memberId, viewRefId } = input;
    const search: T = { memberId: memberId, viewRefId: viewRefId };
    return await this.viewModel.findOne(search).exec();
  }

  public async getVisitedProducts(
    memberId: ObjectId,
    input: OrdinaryInquiry,
  ): Promise<Products> {
    const { page, limit } = input;
    const match: T = { viewGroup: ViewGroup.PRODUCT, memberId: memberId };

    const data: T = await this.viewModel
      .aggregate([
        { $match: match },
        { $sort: { updatedAt: -1 } },
        {
          $lookup: {
            from: 'products',
            localField: 'viewRefId',
            foreignField: '_id',
            as: 'visitedProduct',
          },
        },
        { $unwind: '$visitedProduct' },
        {
          $facet: {
            list: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              lookupVisit,
              { $unwind: '$visitedProduct.memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    const result: Products = { list: [], metaCounter: data[0].metaCounter };
    result.list = data[0].list.map((ele) => ele.visitedProduct);

    return result;
  }
}
