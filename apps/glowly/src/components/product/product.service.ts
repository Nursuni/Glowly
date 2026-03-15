import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Product, Products } from '../../libs/dto/product/product';
import { InjectModel } from '@nestjs/mongoose';
import { ViewService } from '../view/view.service';
import { AuthService } from '../auth/auth.service';
import {
  AllProductsInquiry,
  ProductInput,
  ProductsInquiry,
  BrandProductsInquiry,
  OrdinaryInquiry,
} from '../../libs/dto/product/product.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';
import { StatisticModifier, T } from '../../libs/types/common';
import { ProductStatus } from '../../libs/enums/product.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import moment from 'moment';
import {
  lookupAuthMemberLiked,
  lookupMember,
  shapeIntoMongoObjectId,
} from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private viewService: ViewService,
    private memberService: MemberService,
    private authService: AuthService,
    private likeService: LikeService,
  ) {}

  public async createProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberProducts',
        modifier: 1,
      });
      return result;
    } catch (err) {
      console.log('err Service model', err.message);
      throw new BadRequestException(Message.UPDATE_FAILED);
    }
  }

  public async getProduct(
    memberId: ObjectId,
    productId: ObjectId,
  ): Promise<Product> {
    const search: T = {
      _id: productId,
      productStatus: ProductStatus.ACTIVE,
    };

    const targetProduct: Product = await this.productModel
      .findOne(search)
      .lean()
      .exec();
    if (!targetProduct)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    if (memberId) {
      const viewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        await this.productStatsEditor({
          _id: productId,
          targetKey: 'productViews',
          modifier: 1,
        });
        targetProduct.productViews++;
      }

      const likeInput = {
        memberId: memberId,
        likeRefId: productId,
        likeGroup: LikeGroup.PRODUCT,
      };
      targetProduct.meLiked =
        await this.likeService.checkLikeExistence(likeInput);
    }
    targetProduct.memberData = await this.memberService.getMember(
      null,
      targetProduct.memberId,
    );
    return targetProduct;
  }

  public async productStatsEditor(input: StatisticModifier): Promise<Product> {
    const { _id, targetKey, modifier } = input;
    return await this.productModel
      .findByIdAndUpdate(
        _id,
        { $inc: { [targetKey]: modifier } },
        {
          new: true,
        },
      )
      .exec();
  }

  public async updateProduct(
    memberId: ObjectId,
    input: ProductUpdate,
  ): Promise<Product> {
    let { productStatus, soldAt, deletedAt } = input;
    const search: T = {
      _id: input._id,
      memberId: memberId,
      productStatus: ProductStatus.ACTIVE,
    };

    if (productStatus === ProductStatus.SOLD) {
      input.soldAt = moment().toDate();
    } else if (productStatus === ProductStatus.DELETED) {
      input.deletedAt = moment().toDate();
    }

    const result = await this.productModel
      .findOneAndUpdate(search, { $set: input }, { new: true })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (soldAt || deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberProducts',
        modifier: -1,
      });
    }

    return result;
  }

  public async getProducts(
    memberId: ObjectId,
    input: ProductsInquiry,
  ): Promise<Products> {
    const match: T = { productStatus: ProductStatus.ACTIVE };
    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
    };

    this.shapeMatchQuery(match, input); //
    console.log('match:', match);

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupAuthMemberLiked(memberId),
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  private shapeMatchQuery(match: T, input: ProductsInquiry): void {
    const {
      memberId,
      text,
      skinType,
      productTypeList,
      productTarget,
      ageRange,
      pricesRange,
    } = input.search;
    if (skinType && skinType.length) {
      match.skinType = { $in: skinType };
    }
    if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);

    if (productTypeList && productTypeList.length) {
      match.productType = { $in: productTypeList };
    }
    if (ageRange?.length) {
      match.ageRange = { $in: ageRange };
    }
    if (productTarget) {
      match.productTarget = productTarget;
    }
    if (pricesRange)
      match.productPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
  }
  //TODO: text
  //if (text) match.productTitle = { $regex: new RegExp(text, 'i') };
  public async getBrandProducts(
    memberId: ObjectId,
    input: BrandProductsInquiry,
  ): Promise<Products> {
    const { productStatus } = input.search;
    if (productStatus === ProductStatus.DELETED)
      throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

    const match: T = {
      memberId: memberId,
      productStatus: productStatus ?? { $ne: ProductStatus.DELETED },
    };
    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
    };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  public async getAllProductsByAdmin(
    input: AllProductsInquiry,
  ): Promise<Products> {
    const { productStatus, productTypeList } = input.search;
    const match: T = {};
    const sort: T = {
      [input?.sort ?? 'createdAt']: (input?.direction ?? Direction.DESC) as
        | 1
        | -1,
    };

    if (productStatus) match.productStatus = productStatus;
    if (productTypeList?.length) {
      match.productType = { $in: productTypeList };
    }

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  public async updateProductByAdmin(input: ProductUpdate): Promise<Product> {
    let { productStatus, soldAt, deletedAt } = input;
    const search: T = {
      _id: input._id,
      productStatus: ProductStatus.ACTIVE,
    };

    if (productStatus === ProductStatus.SOLD) input.soldAt = moment().toDate();
    else if (productStatus === ProductStatus.DELETED)
      input.deletedAt = moment().toDate();

    const result = await this.productModel
      .findOneAndUpdate(search, { $set: input }, { new: true })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (soldAt || deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberProducts',
        modifier: -1,
      });
    }

    return result;
  }

  public async removeProductByAdmin(productId: ObjectId): Promise<Product> {
    const search: T = { _id: productId, productStatus: ProductStatus.DELETED };
    const result = await this.productModel.findOneAndDelete(search).exec();

    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
    return result;
  }

  public async getFavorites(
    memberId: ObjectId,
    input: OrdinaryInquiry,
  ): Promise<Products> {
    return await this.likeService.getFavoriteProducts(memberId, input);
  }

  public async likeTargetProduct(
    memberId: ObjectId,
    likeRefId: ObjectId,
  ): Promise<Product> {
    const target: Product = await this.productModel
      .findOne({ _id: likeRefId, productStatus: ProductStatus.ACTIVE })
      .exec();
    if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const input: LikeInput = {
      memberId: memberId,
      likeRefId: likeRefId,
      likeGroup: LikeGroup.PRODUCT,
    };

    const modifier: number = await this.likeService.toggleLike(input);
    const result = await this.productStatsEditor({
      _id: likeRefId,
      targetKey: 'productLikes',
      modifier: modifier,
    });

    if (!result)
      throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    return result;
    // LIKE TOGGLE
  }

  public async getVisited(
    memberId: ObjectId,
    input: OrdinaryInquiry,
  ): Promise<Products> {
    return await this.viewService.getVisitedProducts(memberId, input);
  }
}
