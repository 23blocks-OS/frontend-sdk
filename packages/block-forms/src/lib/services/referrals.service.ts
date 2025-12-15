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
  list(formUniqueId: string, params?: ListReferralsParams): Promise<PageResult<Referral>>;
  get(formUniqueId: string, uniqueId: string): Promise<Referral>;
  create(formUniqueId: string, data: CreateReferralRequest): Promise<Referral>;
  update(formUniqueId: string, uniqueId: string, data: UpdateReferralRequest): Promise<Referral>;
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createReferralsService(transport: Transport, _config: { appId: string }): ReferralsService {
  return {
    async list(formUniqueId: string, params?: ListReferralsParams): Promise<PageResult<Referral>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.referrerUniqueId) queryParams['referrer_unique_id'] = params.referrerUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/referrals/${formUniqueId}/instances`, { params: queryParams });
      return decodePageResult(response, referralMapper);
    },

    async get(formUniqueId: string, uniqueId: string): Promise<Referral> {
      const response = await transport.get<unknown>(`/referrals/${formUniqueId}/instances/${uniqueId}`);
      return decodeOne(response, referralMapper);
    },

    async create(formUniqueId: string, data: CreateReferralRequest): Promise<Referral> {
      const response = await transport.post<unknown>(`/referrals/${formUniqueId}/instances`, {
        referral: {
          referrer_unique_id: data.referrerUniqueId,
          referrer_email: data.referrerEmail,
          referrer_name: data.referrerName,
          referee_email: data.refereeEmail,
          referee_name: data.refereeName,
          referee_phone: data.refereePhone,
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, referralMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateReferralRequest): Promise<Referral> {
      const response = await transport.put<unknown>(`/referrals/${formUniqueId}/instances/${uniqueId}`, {
        referral: {
          referee_email: data.refereeEmail,
          referee_name: data.refereeName,
          referee_phone: data.refereePhone,
          data: data.data,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, referralMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/referrals/${formUniqueId}/instances/${uniqueId}`);
    },
  };
}
