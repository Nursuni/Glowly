import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from '../../libs/dto/product/product';
import { InjectModel } from '@nestjs/mongoose';
import { ViewService } from '../view/view.service';
import { AuthService } from '../auth/auth.service';
import { ProductInput } from '../../libs/dto/product/product.input';
import { Message } from '../../libs/enums/common.enum';
import { MemberService } from '../member/member.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private viewService: ViewService,
    private memberService: MemberService,
    private authService: AuthService,
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
}
