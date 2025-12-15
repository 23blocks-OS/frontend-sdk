import type { Transport } from '@23blocks/contracts';

export interface AbandonedCart {
  uniqueId: string;
  userUniqueId: string;
  totalAmount: number;
  itemCount: number;
  abandonedAt: Date;
  lastActivityAt: Date;
  payload?: Record<string, unknown>;
}

export interface AbandonedCartsParams {
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  page?: number;
  perPage?: number;
}

export interface RemarketingService {
  getAbandonedCarts(params?: AbandonedCartsParams): Promise<{ carts: AbandonedCart[]; total: number }>;
}

export function createRemarketingService(transport: Transport, _config: { appId: string }): RemarketingService {
  return {
    async getAbandonedCarts(params?: AbandonedCartsParams): Promise<{ carts: AbandonedCart[]; total: number }> {
      const response = await transport.post<any>('/tools/remarketing/carts/abandoned', {
        start_date: params?.startDate?.toISOString(),
        end_date: params?.endDate?.toISOString(),
        min_amount: params?.minAmount,
        page: params?.page,
        per_page: params?.perPage,
      });
      return {
        carts: (response.carts || []).map((c: any) => ({
          uniqueId: c.unique_id,
          userUniqueId: c.user_unique_id,
          totalAmount: c.total_amount,
          itemCount: c.item_count,
          abandonedAt: new Date(c.abandoned_at),
          lastActivityAt: new Date(c.last_activity_at),
          payload: c.payload,
        })),
        total: response.total || 0,
      };
    },
  };
}
