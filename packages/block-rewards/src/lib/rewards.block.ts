import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createRewardsService,
  createCouponsService,
  createLoyaltyService,
  createBadgesService,
  createCouponConfigurationsService,
  createOfferCodesService,
  createExpirationRulesService,
  createRewardsCustomersService,
  createBadgeCategoriesService,
  createMoneyRulesService,
  createProductRulesService,
  createEventRulesService,
  type RewardsService,
  type CouponsService,
  type LoyaltyService,
  type BadgesService,
  type CouponConfigurationsService,
  type OfferCodesService,
  type ExpirationRulesService,
  type RewardsCustomersService,
  type BadgeCategoriesService,
  type MoneyRulesService,
  type ProductRulesService,
  type EventRulesService,
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
  couponConfigurations: CouponConfigurationsService;
  offerCodes: OfferCodesService;
  expirationRules: ExpirationRulesService;
  customers: RewardsCustomersService;
  badgeCategories: BadgeCategoriesService;
  moneyRules: MoneyRulesService;
  productRules: ProductRulesService;
  eventRules: EventRulesService;
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
    couponConfigurations: createCouponConfigurationsService(transport, config),
    offerCodes: createOfferCodesService(transport, config),
    expirationRules: createExpirationRulesService(transport, config),
    customers: createRewardsCustomersService(transport, config),
    badgeCategories: createBadgeCategoriesService(transport, config),
    moneyRules: createMoneyRulesService(transport, config),
    productRules: createProductRulesService(transport, config),
    eventRules: createEventRulesService(transport, config),
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
    'CouponConfiguration',
    'OfferCode',
    'ExpirationRule',
    'RewardsCustomer',
    'BadgeCategory',
    'MoneyRule',
    'ProductRule',
    'EventRule',
  ],
};
