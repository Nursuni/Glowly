import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Product, Products } from '../../libs/dto/product/product';
import {
  AllProductsInquiry,
  ProductInput,
  ProductsInquiry,
  SellerProductsInquiry,
} from '../../libs/dto/product/product.input';
import * as mongoose from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { ProductUpdate } from '../../libs/dto/product/product.update';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Roles(MemberType.SELLER)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  public async createProduct(
    @Args('input') input: ProductInput,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Product> {
    console.log('Mutation: createProduct');
    console.log('memberId from decorator:', memberId);
    input.memberId = memberId;

    return await this.productService.createProduct(input);
  }

  @UseGuards(WithoutGuard)
  @Query((returns) => Product)
  public async getProduct(
    @Args('ProductId') input: string,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Product> {
    console.log('Query: getProduct');
    const productId = shapeIntoMongoObjectId(input);
    return await this.productService.getProduct(memberId, productId);
  }

  @Roles(MemberType.SELLER)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Product)
  public async updateProduct(
    @Args('input') input: ProductUpdate,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Product> {
    console.log('Mutation: updateProduct');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.productService.updateProduct(memberId, input);
  }

  @UseGuards(WithoutGuard)
  @Query((returns) => Products)
  public async getProducts(
    @Args('input') input: ProductsInquiry,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Products> {
    console.log('Query: getProducts');
    return await this.productService.getProducts(memberId, input);
  }

  @Roles(MemberType.SELLER)
  @UseGuards(RolesGuard)
  @Query((returns) => Products)
  public async getSellerProducts(
    @Args('input') input: SellerProductsInquiry,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Products> {
    console.log('Query: getAgentProducts');
    return await this.productService.getSellerProducts(memberId, input);
  }

  /**ADMIN */
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query((returns) => Products)
  public async getAllProductsByAdmin(
    @Args('input') input: AllProductsInquiry,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Products> {
    console.log('Query: getAllProductsByAdmin');
    return await this.productService.getAllProductsByAdmin(input);
  }
}
