import { Schema } from 'mongoose';

const BrandSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    businessPhone: {
      type: String,
      required: true,
    },
    businessLicense: {
      type: String, // URL to uploaded license document
      required: true,
    },
    taxId: {
      type: String,
      required: true,
    },
    bankAccountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // status: {
    //   type: String,
    //   enum: SellerApplicationStatus,
    //   default: SellerApplicationStatus.PENDING,
    // },
    rejectionReason: {
      type: String,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: 'sellers' },
);

export default SellerSchema;
