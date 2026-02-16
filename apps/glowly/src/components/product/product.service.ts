import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from '../../libs/dto/product/product';
import { InjectModel } from '@nestjs/mongoose';
import { ViewService } from '../view/view.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly memberModel: Model<null>,
    private viewService: ViewService,
    private authService: AuthService,
  ) {}
}
