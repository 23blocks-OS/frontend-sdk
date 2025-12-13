// Block factory and metadata
export { createRewardsBlock, rewardsBlockMetadata } from './lib/rewards.block';
export type { RewardsBlock, RewardsBlockConfig } from './lib/rewards.block';

// Types
export type {
  // Reward types
  Reward,
  RewardType,
  RewardRedemption,
  CreateRewardRequest,
  UpdateRewardRequest,
  ListRewardsParams,
  RedeemRewardRequest,
  // Coupon types
  Coupon,
  DiscountType,
  CouponApplication,
  CreateCouponRequest,
  UpdateCouponRequest,
  ListCouponsParams,
  ValidateCouponRequest,
  CouponValidationResult,
  ApplyCouponRequest,
  // Loyalty types
  Loyalty,
  LoyaltyTier,
  LoyaltyTransaction,
  AddPointsRequest,
  RedeemPointsRequest,
  ListTransactionsParams,
  // Badge types
  Badge,
  UserBadge,
  CreateBadgeRequest,
  UpdateBadgeRequest,
  ListBadgesParams,
  AwardBadgeRequest,
  ListUserBadgesParams,
} from './lib/types';

// Services
export type {
  RewardsService,
  CouponsService,
  LoyaltyService,
  BadgesService,
} from './lib/services';

export {
  createRewardsService,
  createCouponsService,
  createLoyaltyService,
  createBadgesService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  rewardMapper,
  rewardRedemptionMapper,
  couponMapper,
  couponApplicationMapper,
  loyaltyMapper,
  loyaltyTransactionMapper,
  badgeMapper,
  userBadgeMapper,
} from './lib/mappers';
