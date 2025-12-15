import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CouponConfiguration,
  CreateCouponConfigurationRequest,
  UpdateCouponConfigurationRequest,
  ListCouponConfigurationsParams,
} from '../types/coupon-configuration';
import type { Coupon } from '../types/coupon';
import { couponConfigurationMapper } from '../mappers/coupon-configuration.mapper';
import { couponMapper } from '../mappers/coupon.mapper';

export interface CouponConfigurationsService {
  list(params?: ListCouponConfigurationsParams): Promise<PageResult<CouponConfiguration>>;
  get(uniqueId: string): Promise<CouponConfiguration>;
  create(data: CreateCouponConfigurationRequest): Promise<CouponConfiguration>;
  update(data: UpdateCouponConfigurationRequest): Promise<CouponConfiguration>;
  delete(uniqueId: string): Promise<void>;
  listCoupons(uniqueId: string): Promise<Coupon[]>;
  generateOne(uniqueId: string): Promise<Coupon>;
  generateBatch(uniqueId: string, count: number): Promise<Coupon[]>;
  voidBatch(uniqueId: string, batchId: string): Promise<void>;
  loadCoupons(uniqueId: string, codes: string[]): Promise<Coupon[]>;
}

export function createCouponConfigurationsService(transport: Transport, _config: { appId: string }): CouponConfigurationsService {
  return {
    async list(params?: ListCouponConfigurationsParams): Promise<PageResult<CouponConfiguration>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.isActive !== undefined) queryParams['is_active'] = String(params.isActive);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/configurations/', { params: queryParams });
      return decodePageResult(response, couponConfigurationMapper);
    },

    async get(uniqueId: string): Promise<CouponConfiguration> {
      const response = await transport.get<unknown>(`/configurations/${uniqueId}`);
      return decodeOne(response, couponConfigurationMapper);
    },

    async create(data: CreateCouponConfigurationRequest): Promise<CouponConfiguration> {
      const response = await transport.post<unknown>('/configurations/', {
        configuration: {
          name: data.name,
          description: data.description,
          code: data.code,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          min_purchase: data.minPurchase,
          max_discount: data.maxDiscount,
          usage_limit: data.usageLimit,
          per_user_limit: data.perUserLimit,
          start_date: data.startDate?.toISOString(),
          end_date: data.endDate?.toISOString(),
          is_active: data.isActive,
          payload: data.payload,
        },
      });
      return decodeOne(response, couponConfigurationMapper);
    },

    async update(data: UpdateCouponConfigurationRequest): Promise<CouponConfiguration> {
      const response = await transport.put<unknown>('/configurations/', {
        configuration: {
          name: data.name,
          description: data.description,
          code: data.code,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          min_purchase: data.minPurchase,
          max_discount: data.maxDiscount,
          usage_limit: data.usageLimit,
          per_user_limit: data.perUserLimit,
          start_date: data.startDate?.toISOString(),
          end_date: data.endDate?.toISOString(),
          is_active: data.isActive,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, couponConfigurationMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/configurations/${uniqueId}`);
    },

    async listCoupons(uniqueId: string): Promise<Coupon[]> {
      const response = await transport.get<unknown>(`/configurations/${uniqueId}/coupons`);
      return decodeMany(response, couponMapper);
    },

    async generateOne(uniqueId: string): Promise<Coupon> {
      const response = await transport.post<unknown>(`/configurations/${uniqueId}/one`, {});
      return decodeOne(response, couponMapper);
    },

    async generateBatch(uniqueId: string, count: number): Promise<Coupon[]> {
      const response = await transport.post<unknown>(`/configurations/${uniqueId}/batch`, {
        count,
      });
      return decodeMany(response, couponMapper);
    },

    async voidBatch(uniqueId: string, batchId: string): Promise<void> {
      await transport.put(`/configurations/${uniqueId}/batches/${batchId}/void`, {});
    },

    async loadCoupons(uniqueId: string, codes: string[]): Promise<Coupon[]> {
      const response = await transport.post<unknown>(`/configurations/${uniqueId}/load`, {
        codes,
      });
      return decodeMany(response, couponMapper);
    },
  };
}
