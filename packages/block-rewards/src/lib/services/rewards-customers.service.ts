import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  RewardsCustomer,
  CustomerRewardExpiration,
  CustomerRewardHistory,
  ListRewardsCustomersParams,
} from '../types/rewards-customer';
import type { Loyalty } from '../types/loyalty';
import type { Badge } from '../types/badge';
import type { Coupon } from '../types/coupon';
import type { OfferCode } from '../types/offer-code';
import { rewardsCustomerMapper } from '../mappers/rewards-customer.mapper';
import { loyaltyMapper } from '../mappers/loyalty.mapper';
import { badgeMapper } from '../mappers/badge.mapper';
import { couponMapper } from '../mappers/coupon.mapper';
import { offerCodeMapper } from '../mappers/offer-code.mapper';

export interface RewardsCustomersService {
  list(params?: ListRewardsCustomersParams): Promise<PageResult<RewardsCustomer>>;
  get(uniqueId: string): Promise<RewardsCustomer>;
  getLoyaltyTier(uniqueId: string): Promise<Loyalty>;
  getRewards(uniqueId: string): Promise<unknown>;
  getRewardExpirations(uniqueId: string): Promise<CustomerRewardExpiration[]>;
  getRewardHistory(uniqueId: string): Promise<CustomerRewardHistory[]>;
  getBadges(uniqueId: string): Promise<Badge[]>;
  getCoupons(uniqueId: string): Promise<Coupon[]>;
  getOfferCodes(uniqueId: string): Promise<OfferCode[]>;
  grantReward(uniqueId: string, points: number, reason?: string): Promise<RewardsCustomer>;
  updateExpiration(uniqueId: string, expirationDate: Date): Promise<RewardsCustomer>;
}

export function createRewardsCustomersService(transport: Transport, _config: { appId: string }): RewardsCustomersService {
  return {
    async list(params?: ListRewardsCustomersParams): Promise<PageResult<RewardsCustomer>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.loyaltyTierUniqueId) queryParams['loyalty_tier_unique_id'] = params.loyaltyTierUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/customers', { params: queryParams });
      return decodePageResult(response, rewardsCustomerMapper);
    },

    async get(uniqueId: string): Promise<RewardsCustomer> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/`);
      return decodeOne(response, rewardsCustomerMapper);
    },

    async getLoyaltyTier(uniqueId: string): Promise<Loyalty> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/loyalty`);
      return decodeOne(response, loyaltyMapper);
    },

    async getRewards(uniqueId: string): Promise<unknown> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/rewards`);
      return response;
    },

    async getRewardExpirations(uniqueId: string): Promise<CustomerRewardExpiration[]> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/rewards/expirations`);
      // Raw array response - parse manually
      if (Array.isArray(response)) {
        return response as CustomerRewardExpiration[];
      }
      return [];
    },

    async getRewardHistory(uniqueId: string): Promise<CustomerRewardHistory[]> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/rewards/history`);
      // Raw array response - parse manually
      if (Array.isArray(response)) {
        return response as CustomerRewardHistory[];
      }
      return [];
    },

    async getBadges(uniqueId: string): Promise<Badge[]> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/badges`);
      return decodeMany(response, badgeMapper);
    },

    async getCoupons(uniqueId: string): Promise<Coupon[]> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/coupons`);
      return decodeMany(response, couponMapper);
    },

    async getOfferCodes(uniqueId: string): Promise<OfferCode[]> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/offer_codes`);
      return decodeMany(response, offerCodeMapper);
    },

    async grantReward(uniqueId: string, points: number, reason?: string): Promise<RewardsCustomer> {
      const response = await transport.put<unknown>(`/customers/${uniqueId}/grant_reward`, {
        reward: {
          points,
          reason,
        },
      });
      return decodeOne(response, rewardsCustomerMapper);
    },

    async updateExpiration(uniqueId: string, expirationDate: Date): Promise<RewardsCustomer> {
      const response = await transport.put<unknown>(`/customers/${uniqueId}/expiration`, {
        expiration_date: expirationDate.toISOString(),
      });
      return decodeOne(response, rewardsCustomerMapper);
    },
  };
}
