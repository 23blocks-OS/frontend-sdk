import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createRewardsService,
  createCouponsService,
  createLoyaltyService,
  createBadgesService,
  type RewardsService,
  type CouponsService,
  type LoyaltyService,
  type BadgesService,
} from './services';

export interface RewardsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface RewardsBlock {
  rewards: RewardsService;
  coupons: CouponsService;
  loyalty: LoyaltyService;
  badges: BadgesService;
}

export function createRewardsBlock(
  transport: Transport,
  config: RewardsBlockConfig
): RewardsBlock {
  return {
    rewards: createRewardsService(transport, config),
    coupons: createCouponsService(transport, config),
    loyalty: createLoyaltyService(transport, config),
    badges: createBadgesService(transport, config),
  };
}

export const rewardsBlockMetadata: BlockMetadata = {
  name: 'rewards',
  version: '0.1.0',
  description: 'Loyalty programs, rewards, coupons, badges, and gamification',
  resourceTypes: [
    'Reward',
    'RewardRedemption',
    'Coupon',
    'CouponApplication',
    'Loyalty',
    'LoyaltyTransaction',
    'Badge',
    'UserBadge',
  ],
};
