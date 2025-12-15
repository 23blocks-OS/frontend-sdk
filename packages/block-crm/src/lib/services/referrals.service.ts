import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Referral,
  CreateReferralRequest,
  UpdateReferralRequest,
  ListReferralsParams,
} from '../types/referral';
import { referralMapper } from '../mappers/referral.mapper';

export interface ReferralsService {
  list(params?: ListReferralsParams): Promise<PageResult<Referral>>;
  get(uniqueId: string): Promise<Referral>;
  create(data: CreateReferralRequest): Promise<Referral>;
  update(uniqueId: string, data: UpdateReferralRequest): Promise<Referral>;
  delete(uniqueId: string): Promise<void>;
}

export function createReferralsService(transport: Transport, _config: { appId: string }): ReferralsService {
  return {
    async list(params?: ListReferralsParams): Promise<PageResult<Referral>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.referrerUniqueId) queryParams['referrer_unique_id'] = params.referrerUniqueId;
      if (params?.referredUniqueId) queryParams['referred_unique_id'] = params.referredUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/referrals', { params: queryParams });
      return decodePageResult(response, referralMapper);
    },

    async get(uniqueId: string): Promise<Referral> {
      const response = await transport.get<unknown>(`/referrals/${uniqueId}`);
      return decodeOne(response, referralMapper);
    },

    async create(data: CreateReferralRequest): Promise<Referral> {
      const response = await transport.post<unknown>('/referrals', {
        referral: {
          referrer_unique_id: data.referrerUniqueId,
          referred_unique_id: data.referredUniqueId,
          referral_code: data.referralCode,
          source: data.source,
          payload: data.payload,
        },
      });
      return decodeOne(response, referralMapper);
    },

    async update(uniqueId: string, data: UpdateReferralRequest): Promise<Referral> {
      const response = await transport.put<unknown>(`/referrals/${uniqueId}`, {
        referral: {
          referral_code: data.referralCode,
          source: data.source,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, referralMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/referrals/${uniqueId}`);
    },
  };
}
