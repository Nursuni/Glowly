import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member, Members } from '../../libs/dto/member/member';
import {
  LoginInput,
  MemberInput,
  MembersInquiry,
  BrandsInquiry,
} from '../../libs/dto/member/member.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import * as mongoose from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import {
  getSerialForImage,
  shapeIntoMongoObjectId,
  validMimeTypes,
} from '../../libs/config';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Message } from '../../libs/enums/common.enum';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { T } from '../../libs/types/common';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(AuthGuard) //a valid JWT token can access this
  @Query(() => String)
  public async checkAuth(
    @AuthMember('memberNick') memberNick: string,
  ): Promise<string> {
    console.log('Mutation: checkAuth');
    console.log('membernick:', memberNick);
    return `Hi ${memberNick}`;
  }
  @Roles(MemberType.USER, MemberType.BRAND)
  @UseGuards(RolesGuard)
  @Query(() => String)
  public async checkAuthRoles(
    @AuthMember() authMember: Member,
  ): Promise<string> {
    console.log('Mutation: checkAuthRoles');
    return `Hi ${authMember.memberNick}, your are ${authMember.memberType} (memberId ${authMember._id})`;
  }
  //TODO: ADD gender
  @Mutation(() => Member)
  public async signup(@Args('input') input: MemberInput): Promise<Member> {
    console.log('Mutation: signup');
    console.log('input', input);
    return await this.memberService.signup(input);
  }
  @Mutation(() => Member)
  public async login(@Args('input') input: LoginInput): Promise<Member> {
    console.log('Mutation: login');
    return await this.memberService.login(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Member)
  public async updateMember(
    @Args('input') input: MemberUpdate,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Member> {
    console.log('Mutation: updateMember');
    delete input._id;
    return await this.memberService.updateMember(memberId, input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Member)
  public async getMember(
    @Args('memberId') input: string,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Member> {
    const targetId = shapeIntoMongoObjectId(input);
    return await this.memberService.getMember(memberId, targetId);
  }

  /** AUTHORIZATION: ADMIN */
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Members)
  public async getAllMembersByAdmin(
    @Args('input') input: MembersInquiry,
  ): Promise<Members> {
    return await this.memberService.getAllMembersByAdmin(input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Members)
  public async getBrands(
    @Args('input') input: BrandsInquiry,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Members> {
    return await this.memberService.getBrands(memberId, input);
  }

  /** AUTHORIZATION: ADMIN */
  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Member)
  public async updateMemberByAdmin(
    @Args('input') input: MemberUpdate,
  ): Promise<Member> {
    console.log('Mutation: updateMemberByAdmin');
    return await this.memberService.updateMemberByAdmin(input);
  }

  // IMAGE UPLOADER
  @UseGuards(AuthGuard) //Rest API => Multer Graphql => GraphQLUpload
  @Mutation((returns) => String)
  public async imageUploader(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename, mimetype }: FileUpload,
    @Args('target') target: String, //serverdan kelyabgan rasm qaysi manzilda saqlashini belgilab beramiz
  ): Promise<string> {
    console.log('Mutation: imageUploader');

    if (!filename) throw new Error(Message.UPLOAD_FAILED);
    const validMime = validMimeTypes.includes(mimetype); //valid types
    if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

    const imageName = getSerialForImage(filename); //random nom tanlayabmiz
    const url = `uploads/${target}/${imageName}`; //target folderimizga saqalanadi
    const stream = createReadStream(); //yuklash mantigi

    const result = await new Promise((resolve, reject) => {
      stream
        .pipe(createWriteStream(url))
        .on('finish', async () => resolve(true))
        .on('error', () => reject(false));
    });
    if (!result) throw new Error(Message.UPLOAD_FAILED);

    return url; //rasmimimizdin yuklangan mantigini qaytaradi
  }

  @UseGuards(AuthGuard)
  @Mutation((returns) => [String])
  public async imagesUploader(
    @Args('files', { type: () => [GraphQLUpload] })
    files: Promise<FileUpload>[],
    @Args('target') target: String,
  ): Promise<string[]> {
    console.log('Mutation: imagesUploader');

    const uploadedImages: string[] = [];
    const dir = `uploads/${target}`;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const promisedList = files.map(async (img: Promise<FileUpload>) => {
      try {
        const { filename, mimetype, createReadStream } = await img;
        if (!validMimeTypes.includes(mimetype.toLowerCase())) {
          throw new Error(Message.PROVIDE_ALLOWED_FORMAT);
        }

        const imageName = getSerialForImage(filename);
        const url = `${dir}/${imageName}`;
        const stream = createReadStream();

        await new Promise((resolve, reject) => {
          stream
            .pipe(createWriteStream(url))
            .on('finish', resolve)
            .on('error', reject);
        });

        uploadedImages.push(url);
      } catch (err) {
        console.error('Upload error:', err);
        throw err;
      }
    });

    await Promise.all(promisedList);
    return uploadedImages;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Member)
  public async likeTargetMember(
    @Args('memberId') input: string,
    @AuthMember('_id') memberId: mongoose.ObjectId,
  ): Promise<Member> {
    console.log('Mutation: likeTargetMember');
    const likeRefId = shapeIntoMongoObjectId(input);
    return await this.memberService.likeTargetMember(memberId, likeRefId);
  }
}
