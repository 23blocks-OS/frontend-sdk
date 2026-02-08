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
} from './services/index.js';

/**
 * Configuration for the Rewards block.
 */
export interface RewardsBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Loyalty, rewards, and gamification block interface.
 */
export interface RewardsBlock {
  /** Reward CRUD operations */
  rewards: RewardsService;
  /** Coupon management */
  coupons: CouponsService;
  /** Loyalty program management */
  loyalty: LoyaltyService;
  /** Badge management */
  badges: BadgesService;
  /** Coupon configuration management */
  couponConfigurations: CouponConfigurationsService;
  /** Offer code management */
  offerCodes: OfferCodesService;
  /** Reward expiration rule management */
  expirationRules: ExpirationRulesService;
  /** Rewards customer management */
  customers: RewardsCustomersService;
  /** Badge category management */
  badgeCategories: BadgeCategoriesService;
  /** Money-based reward rule management */
  moneyRules: MoneyRulesService;
  /** Product-based reward rule management */
  productRules: ProductRulesService;
  /** Event-based reward rule management */
  eventRules: EventRulesService;
}

/**
 * Create the Rewards block.
 *
 * @example
 * ```typescript
 * const block = createRewardsBlock(transport, { appId: 'xxx' });
 * const rewards = await block.rewards.list({ page: 1 });
 * ```
 */
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
