import { registerEnumType } from '@nestjs/graphql';

// ✅ Add Seller Application Status
export enum SellerApplicationStatus {
  PENDING = 'PENDING', // Submitted, waiting for review
  APPROVED = 'APPROVED', // Approved by admin
  REJECTED = 'REJECTED', // Rejected by admin
  REVISION_NEEDED = 'REVISION_NEEDED', // Needs more info
}

registerEnumType(SellerApplicationStatus, {
  name: 'SellerApplicationStatus',
  description: 'Status of seller application',
});

export enum MembershipTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

registerEnumType(MembershipTier, {
  name: 'MembershipTier',
  description: 'Membership tier level for rewards and benefits',
  valuesMap: {
    BRONZE: { description: 'Entry level - 0-999 points' },
    SILVER: { description: 'Silver level - 1,000-4,999 points' },
    GOLD: { description: 'Gold level - 5,000-9,999 points' },
    PLATINUM: { description: 'Platinum level - 10,000-19,999 points' },
    DIAMOND: { description: 'Diamond level - 20,000+ points' },
  },
});
