import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Loyalty,
  LoyaltyTransaction,
  AddPointsRequest,
  RedeemPointsRequest,
  ListTransactionsParams,
} from '../types/loyalty';
import { loyaltyMapper, loyaltyTransactionMapper } from '../mappers/loyalty.mapper';

export interface LoyaltyService {
  get(uniqueId: string): Promise<Loyalty>;
  getByUser(userUniqueId: string): Promise<Loyalty>;
  addPoints(data: AddPointsRequest): Promise<LoyaltyTransaction>;
  redeemPoints(data: RedeemPointsRequest): Promise<LoyaltyTransaction>;
  getHistory(userUniqueId: string, params?: ListTransactionsParams): Promise<PageResult<LoyaltyTransaction>>;
}

export function createLoyaltyService(transport: Transport, _config: { appId: string }): LoyaltyService {
  return {
    async get(uniqueId: string): Promise<Loyalty> {
      const response = await transport.get<unknown>(`/loyalty/${uniqueId}`);
      return decodeOne(response, loyaltyMapper);
    },

    async getByUser(userUniqueId: string): Promise<Loyalty> {
      const response = await transport.get<unknown>(`/loyalty/user/${userUniqueId}`);
      return decodeOne(response, loyaltyMapper);
    },

    async addPoints(data: AddPointsRequest): Promise<LoyaltyTransaction> {
      const response = await transport.post<unknown>('/loyalty/points/add', {
        data: {
          type: 'LoyaltyTransaction',
          attributes: {
            user_unique_id: data.userUniqueId,
            points: data.points,
            reason: data.reason,
            reference_id: data.referenceId,
            reference_type: data.referenceType,
          },
        },
      });
      return decodeOne(response, loyaltyTransactionMapper);
    },

    async redeemPoints(data: RedeemPointsRequest): Promise<LoyaltyTransaction> {
      const response = await transport.post<unknown>('/loyalty/points/redeem', {
        data: {
          type: 'LoyaltyTransaction',
          attributes: {
            user_unique_id: data.userUniqueId,
            points: data.points,
            reason: data.reason,
            reference_id: data.referenceId,
            reference_type: data.referenceType,
          },
        },
      });
      return decodeOne(response, loyaltyTransactionMapper);
    },

    async getHistory(userUniqueId: string, params?: ListTransactionsParams): Promise<PageResult<LoyaltyTransaction>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.type) queryParams['type'] = params.type;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/loyalty/user/${userUniqueId}/history`, { params: queryParams });
      return decodePageResult(response, loyaltyTransactionMapper);
    },
  };
}
