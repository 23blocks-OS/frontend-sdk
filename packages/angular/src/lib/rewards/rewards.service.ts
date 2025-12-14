import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createRewardsBlock,
  type RewardsBlock,
  type RewardsBlockConfig,
  type Reward,
  type RewardRedemption,
  type CreateRewardRequest,
  type UpdateRewardRequest,
  type ListRewardsParams,
  type RedeemRewardRequest,
  type Coupon,
  type CouponApplication,
  type CreateCouponRequest,
  type UpdateCouponRequest,
  type ListCouponsParams,
  type ValidateCouponRequest,
  type CouponValidationResult,
  type ApplyCouponRequest,
  type Loyalty,
  type LoyaltyTransaction,
  type AddPointsRequest,
  type RedeemPointsRequest,
  type ListTransactionsParams,
  type Badge,
  type UserBadge,
  type CreateBadgeRequest,
  type UpdateBadgeRequest,
  type ListBadgesParams,
  type AwardBadgeRequest,
  type ListUserBadgesParams,
} from '@23blocks/block-rewards';
import { TRANSPORT, REWARDS_TRANSPORT, REWARDS_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Rewards block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class RewardsComponent {
 *   constructor(private rewards: RewardsService) {}
 *
 *   listRewards() {
 *     this.rewards.listRewards({ status: 'active' }).subscribe({
 *       next: (result) => console.log('Rewards:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class RewardsService {
  private readonly block: RewardsBlock | null;

  constructor(
    @Optional() @Inject(REWARDS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(REWARDS_CONFIG) config: RewardsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createRewardsBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): RewardsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] RewardsService is not configured. ' +
        "Add 'urls.rewards' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Rewards Service
  // ─────────────────────────────────────────────────────────────────────────────

  listRewards(params?: ListRewardsParams): Observable<PageResult<Reward>> {
    return from(this.ensureConfigured().rewards.list(params));
  }

  getReward(uniqueId: string): Observable<Reward> {
    return from(this.ensureConfigured().rewards.get(uniqueId));
  }

  createReward(data: CreateRewardRequest): Observable<Reward> {
    return from(this.ensureConfigured().rewards.create(data));
  }

  updateReward(uniqueId: string, data: UpdateRewardRequest): Observable<Reward> {
    return from(this.ensureConfigured().rewards.update(uniqueId, data));
  }

  deleteReward(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().rewards.delete(uniqueId));
  }

  redeemReward(data: RedeemRewardRequest): Observable<RewardRedemption> {
    return from(this.ensureConfigured().rewards.redeem(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Coupons Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCoupons(params?: ListCouponsParams): Observable<PageResult<Coupon>> {
    return from(this.ensureConfigured().coupons.list(params));
  }

  getCoupon(uniqueId: string): Observable<Coupon> {
    return from(this.ensureConfigured().coupons.get(uniqueId));
  }

  getCouponByCode(code: string): Observable<Coupon> {
    return from(this.ensureConfigured().coupons.getByCode(code));
  }

  createCoupon(data: CreateCouponRequest): Observable<Coupon> {
    return from(this.ensureConfigured().coupons.create(data));
  }

  updateCoupon(uniqueId: string, data: UpdateCouponRequest): Observable<Coupon> {
    return from(this.ensureConfigured().coupons.update(uniqueId, data));
  }

  deleteCoupon(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().coupons.delete(uniqueId));
  }

  validateCoupon(data: ValidateCouponRequest): Observable<CouponValidationResult> {
    return from(this.ensureConfigured().coupons.validate(data));
  }

  applyCoupon(data: ApplyCouponRequest): Observable<CouponApplication> {
    return from(this.ensureConfigured().coupons.apply(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Loyalty Service
  // ─────────────────────────────────────────────────────────────────────────────

  getLoyalty(uniqueId: string): Observable<Loyalty> {
    return from(this.ensureConfigured().loyalty.get(uniqueId));
  }

  getLoyaltyByUser(userUniqueId: string): Observable<Loyalty> {
    return from(this.ensureConfigured().loyalty.getByUser(userUniqueId));
  }

  addPoints(data: AddPointsRequest): Observable<LoyaltyTransaction> {
    return from(this.ensureConfigured().loyalty.addPoints(data));
  }

  redeemPoints(data: RedeemPointsRequest): Observable<LoyaltyTransaction> {
    return from(this.ensureConfigured().loyalty.redeemPoints(data));
  }

  getLoyaltyHistory(userUniqueId: string, params?: ListTransactionsParams): Observable<PageResult<LoyaltyTransaction>> {
    return from(this.ensureConfigured().loyalty.getHistory(userUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Badges Service
  // ─────────────────────────────────────────────────────────────────────────────

  listBadges(params?: ListBadgesParams): Observable<PageResult<Badge>> {
    return from(this.ensureConfigured().badges.list(params));
  }

  getBadge(uniqueId: string): Observable<Badge> {
    return from(this.ensureConfigured().badges.get(uniqueId));
  }

  createBadge(data: CreateBadgeRequest): Observable<Badge> {
    return from(this.ensureConfigured().badges.create(data));
  }

  updateBadge(uniqueId: string, data: UpdateBadgeRequest): Observable<Badge> {
    return from(this.ensureConfigured().badges.update(uniqueId, data));
  }

  deleteBadge(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().badges.delete(uniqueId));
  }

  awardBadge(data: AwardBadgeRequest): Observable<UserBadge> {
    return from(this.ensureConfigured().badges.award(data));
  }

  listUserBadges(userUniqueId: string, params?: ListUserBadgesParams): Observable<PageResult<UserBadge>> {
    return from(this.ensureConfigured().badges.listByUser(userUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): RewardsBlock {
    return this.ensureConfigured();
  }
}
