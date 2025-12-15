import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Coupon,
  CouponApplication,
  CreateCouponRequest,
  UpdateCouponRequest,
  ListCouponsParams,
  ValidateCouponRequest,
  CouponValidationResult,
  ApplyCouponRequest,
} from '../types/coupon';
import { couponMapper, couponApplicationMapper } from '../mappers/coupon.mapper';

export interface CouponsService {
  list(params?: ListCouponsParams): Promise<PageResult<Coupon>>;
  get(uniqueId: string): Promise<Coupon>;
  getByCode(code: string): Promise<Coupon>;
  create(data: CreateCouponRequest): Promise<Coupon>;
  update(uniqueId: string, data: UpdateCouponRequest): Promise<Coupon>;
  delete(uniqueId: string): Promise<void>;
  validate(data: ValidateCouponRequest): Promise<CouponValidationResult>;
  apply(data: ApplyCouponRequest): Promise<CouponApplication>;
}

export function createCouponsService(transport: Transport, _config: { appId: string }): CouponsService {
  return {
    async list(params?: ListCouponsParams): Promise<PageResult<Coupon>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.discountType) queryParams['discount_type'] = params.discountType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.active !== undefined) queryParams['active'] = String(params.active);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/coupons', { params: queryParams });
      return decodePageResult(response, couponMapper);
    },

    async get(uniqueId: string): Promise<Coupon> {
      const response = await transport.get<unknown>(`/coupons/${uniqueId}`);
      return decodeOne(response, couponMapper);
    },

    async getByCode(code: string): Promise<Coupon> {
      const response = await transport.get<unknown>(`/coupons/code/${code}`);
      return decodeOne(response, couponMapper);
    },

    async create(data: CreateCouponRequest): Promise<Coupon> {
      const response = await transport.post<unknown>('/coupons', {
        coupon: {
            code: data.code,
            name: data.name,
            description: data.description,
            discount_type: data.discountType,
            discount_value: data.discountValue,
            min_purchase: data.minPurchase,
            max_discount: data.maxDiscount,
            usage_limit: data.usageLimit,
            start_date: data.startDate?.toISOString(),
            end_date: data.endDate?.toISOString(),
            payload: data.payload,
          },
      });
      return decodeOne(response, couponMapper);
    },

    async update(uniqueId: string, data: UpdateCouponRequest): Promise<Coupon> {
      const response = await transport.put<unknown>(`/coupons/${uniqueId}`, {
        coupon: {
            name: data.name,
            description: data.description,
            discount_type: data.discountType,
            discount_value: data.discountValue,
            min_purchase: data.minPurchase,
            max_discount: data.maxDiscount,
            usage_limit: data.usageLimit,
            start_date: data.startDate?.toISOString(),
            end_date: data.endDate?.toISOString(),
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, couponMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/coupons/${uniqueId}`);
    },

    async validate(data: ValidateCouponRequest): Promise<CouponValidationResult> {
      const response = await transport.post<unknown>('/coupons/validate', {
        couponvalidation: {
            code: data.code,
            user_unique_id: data.userUniqueId,
            purchase_amount: data.purchaseAmount,
          },
      });

      // Parse the validation response
      const result = response as any;
      return {
        valid: result.data?.attributes?.valid || false,
        coupon: result.data?.attributes?.coupon ? couponMapper.map(result.data.attributes.coupon) : undefined,
        discountAmount: result.data?.attributes?.discount_amount,
        reason: result.data?.attributes?.reason,
      };
    },

    async apply(data: ApplyCouponRequest): Promise<CouponApplication> {
      const response = await transport.post<unknown>('/coupons/apply', {
        couponapplication: {
            code: data.code,
            user_unique_id: data.userUniqueId,
            order_unique_id: data.orderUniqueId,
            cart_unique_id: data.cartUniqueId,
            purchase_amount: data.purchaseAmount,
          },
      });
      return decodeOne(response, couponApplicationMapper);
    },
  };
}
