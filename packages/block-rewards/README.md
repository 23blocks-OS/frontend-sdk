# @23blocks/block-rewards

Rewards block for the 23blocks SDK - rewards, coupons, loyalty programs, and badges.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-rewards.svg)](https://www.npmjs.com/package/@23blocks/block-rewards)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-rewards @23blocks/transport-http
```

## Overview

This package provides rewards and loyalty program functionality including:

- **Rewards** - Reward definitions and redemptions
- **Coupons** - Discount codes and validation
- **Loyalty** - Points programs and transactions
- **Badges** - Achievement badges and gamification

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createRewardsBlock } from '@23blocks/block-rewards';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const rewards = createRewardsBlock(transport, {
  apiKey: 'your-api-key',
});

// Get user's loyalty balance
const loyalty = await rewards.loyalty.getBalance('user-id');
console.log('Points:', loyalty.points, 'Tier:', loyalty.tier);

// Validate a coupon
const validation = await rewards.coupons.validate({
  code: 'SAVE20',
  cartTotal: 100,
});
```

## Services

### rewards - Reward Management

```typescript
// List available rewards
const { data: rewardList } = await rewards.rewards.list({
  status: 'active',
  type: 'points_redemption',
});

// Get reward by ID
const reward = await rewards.rewards.get('reward-id');

// Create reward
const newReward = await rewards.rewards.create({
  name: 'Free Coffee',
  description: 'Redeem 100 points for a free coffee',
  type: 'points_redemption',
  pointsCost: 100,
  status: 'active',
  validFrom: '2024-01-01',
  validTo: '2024-12-31',
});

// Update reward
await rewards.rewards.update('reward-id', {
  pointsCost: 80,
});

// Delete reward
await rewards.rewards.delete('reward-id');

// Redeem reward
const redemption = await rewards.rewards.redeem({
  rewardId: 'reward-id',
  userId: 'user-id',
});
console.log('Redemption code:', redemption.code);

// List redemptions
const { data: redemptions } = await rewards.rewards.listRedemptions({
  userId: 'user-id',
  status: 'pending',
});
```

### coupons - Coupon Management

```typescript
// List coupons
const { data: couponList } = await rewards.coupons.list({
  status: 'active',
});

// Get coupon by ID
const coupon = await rewards.coupons.get('coupon-id');

// Get coupon by code
const coupon = await rewards.coupons.getByCode('SAVE20');

// Create coupon
const newCoupon = await rewards.coupons.create({
  code: 'SUMMER24',
  description: 'Summer sale discount',
  discountType: 'percentage',
  discountValue: 20,
  minOrderAmount: 50,
  maxUses: 1000,
  maxUsesPerUser: 1,
  validFrom: '2024-06-01',
  validTo: '2024-08-31',
  status: 'active',
});

// Update coupon
await rewards.coupons.update('coupon-id', {
  maxUses: 2000,
});

// Delete coupon
await rewards.coupons.delete('coupon-id');

// Validate coupon
const validation = await rewards.coupons.validate({
  code: 'SUMMER24',
  cartTotal: 100,
  userId: 'user-id',
});

if (validation.valid) {
  console.log('Discount:', validation.discountAmount);
} else {
  console.log('Invalid:', validation.error);
}

// Apply coupon
const application = await rewards.coupons.apply({
  code: 'SUMMER24',
  orderId: 'order-id',
  userId: 'user-id',
});
```

### loyalty - Loyalty Program

```typescript
// Get user's loyalty status
const loyalty = await rewards.loyalty.getBalance('user-id');
console.log('Points:', loyalty.points);
console.log('Tier:', loyalty.tier);
console.log('Lifetime points:', loyalty.lifetimePoints);

// Get loyalty tiers
const tiers = await rewards.loyalty.getTiers();
tiers.forEach((tier) => {
  console.log(tier.name, tier.minPoints, tier.benefits);
});

// Add points
await rewards.loyalty.addPoints({
  userId: 'user-id',
  points: 50,
  reason: 'purchase',
  referenceId: 'order-123',
});

// Redeem points
await rewards.loyalty.redeemPoints({
  userId: 'user-id',
  points: 100,
  reason: 'reward_redemption',
  referenceId: 'redemption-456',
});

// List transactions
const { data: transactions } = await rewards.loyalty.listTransactions({
  userId: 'user-id',
  limit: 50,
});

transactions.forEach((tx) => {
  console.log(tx.type, tx.points, tx.reason, tx.createdAt);
});
```

### badges - Badge Management

```typescript
// List available badges
const { data: badgeList } = await rewards.badges.list();

// Get badge by ID
const badge = await rewards.badges.get('badge-id');

// Create badge
const newBadge = await rewards.badges.create({
  name: 'Early Adopter',
  description: 'Joined during beta',
  imageUrl: 'https://example.com/badges/early-adopter.png',
  criteria: {
    type: 'registration_date',
    beforeDate: '2024-01-01',
  },
});

// Update badge
await rewards.badges.update('badge-id', {
  description: 'Updated description',
});

// Delete badge
await rewards.badges.delete('badge-id');

// Award badge to user
await rewards.badges.award({
  badgeId: 'badge-id',
  userId: 'user-id',
  awardedAt: new Date().toISOString(),
});

// List user's badges
const { data: userBadges } = await rewards.badges.listUserBadges({
  userId: 'user-id',
});

userBadges.forEach((ub) => {
  console.log(ub.badge.name, ub.awardedAt);
});

// Revoke badge
await rewards.badges.revoke('user-badge-id');
```

## Types

```typescript
import type {
  Reward,
  RewardType,
  RewardRedemption,
  Coupon,
  DiscountType,
  CouponValidationResult,
  Loyalty,
  LoyaltyTier,
  LoyaltyTransaction,
  Badge,
  UserBadge,
  CreateRewardRequest,
  RedeemRewardRequest,
  CreateCouponRequest,
  ValidateCouponRequest,
  AddPointsRequest,
  CreateBadgeRequest,
  AwardBadgeRequest,
} from '@23blocks/block-rewards';
```

### DiscountType

- `percentage` - Percentage discount (e.g., 20% off)
- `fixed` - Fixed amount discount (e.g., $10 off)
- `free_shipping` - Free shipping

### RewardType

- `points_redemption` - Redeem with loyalty points
- `coupon_reward` - Receive a coupon code
- `product_reward` - Receive a free product
- `experience_reward` - Access to exclusive experience

## Related Packages

- [`@23blocks/block-products`](https://www.npmjs.com/package/@23blocks/block-products) - Product catalog
- [`@23blocks/block-sales`](https://www.npmjs.com/package/@23blocks/block-sales) - Orders and checkout
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
