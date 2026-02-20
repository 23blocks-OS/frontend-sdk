import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Referral,
  CreateReferralRequest,
  UpdateReferralRequest,
  ListReferralsParams,
} from '../types/referral.js';
import { referralMapper } from '../mappers/referral.mapper.js';

export interface ReferralsService {
  /**
   * List referrals with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, referrerUniqueId, referredUniqueId, search), pagination, and sorting.
   * @returns Paginated result containing Referral objects and metadata.
   */
  list(params?: ListReferralsParams): Promise<PageResult<Referral>>;

  /**
   * Retrieve a single referral by its unique identifier.
   * @param uniqueId - The unique identifier of the referral.
   * @returns The matching Referral object.
   */
  get(uniqueId: string): Promise<Referral>;

  /**
   * Create a new referral.
   * @param data - The referral creation payload with referrer, referred, code, and source.
   * @returns The newly created Referral object.
   */
  create(data: CreateReferralRequest): Promise<Referral>;

  /**
   * Update an existing referral.
   * @param uniqueId - The unique identifier of the referral to update.
   * @param data - The fields to update on the referral.
   * @returns The updated Referral object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateReferralRequest): Promise<Referral>;

  /**
   * Delete a referral.
   * @param uniqueId - The unique identifier of the referral to delete.
   * @returns Resolves when the referral has been deleted.
   */
  delete(uniqueId: string): Promise<void>;
}

export function createReferralsService(transport: Transport, _config: { apiKey: string }): ReferralsService {
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
