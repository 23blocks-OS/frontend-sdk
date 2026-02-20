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
  list(formUniqueId: string, params?: ListReferralsParams): Promise<PageResult<Referral>>;
  get(formUniqueId: string, uniqueId: string): Promise<Referral>;
  create(formUniqueId: string, data: CreateReferralRequest): Promise<Referral>;
  update(formUniqueId: string, uniqueId: string, data: UpdateReferralRequest): Promise<Referral>;
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createReferralsService(transport: Transport, _config: { apiKey: string }): ReferralsService {
  return {
    async list(formUniqueId: string, params?: ListReferralsParams): Promise<PageResult<Referral>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
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
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          message: data.message,
          notes: data.notes,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          referred_by_type: data.referredByType,
          referred_by_name: data.referredByName,
          referred_by_unique_id: data.referredByUniqueId,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
        },
      });
      return decodeOne(response, referralMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateReferralRequest): Promise<Referral> {
      const response = await transport.put<unknown>(`/referrals/${formUniqueId}/instances/${uniqueId}`, {
        referral: {
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          message: data.message,
          notes: data.notes,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          referred_by_type: data.referredByType,
          referred_by_name: data.referredByName,
          referred_by_unique_id: data.referredByUniqueId,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
          status: data.status,
        },
      });
      return decodeOne(response, referralMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/referrals/${formUniqueId}/instances/${uniqueId}`);
    },
  };
}
