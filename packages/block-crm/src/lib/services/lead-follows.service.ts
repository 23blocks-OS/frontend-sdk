import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LeadFollow,
  CreateLeadFollowRequest,
  UpdateLeadFollowRequest,
  ListLeadFollowsParams,
} from '../types/lead-follow';
import { leadFollowMapper } from '../mappers/lead-follow.mapper';

export interface LeadFollowsService {
  list(leadUniqueId: string, params?: ListLeadFollowsParams): Promise<PageResult<LeadFollow>>;
  get(leadUniqueId: string, followUniqueId: string): Promise<LeadFollow>;
  create(leadUniqueId: string, data: CreateLeadFollowRequest): Promise<LeadFollow>;
  update(leadUniqueId: string, followUniqueId: string, data: UpdateLeadFollowRequest): Promise<LeadFollow>;
  delete(leadUniqueId: string, followUniqueId: string): Promise<void>;
}

export function createLeadFollowsService(transport: Transport, _config: { appId: string }): LeadFollowsService {
  return {
    async list(leadUniqueId: string, params?: ListLeadFollowsParams): Promise<PageResult<LeadFollow>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.followType) queryParams['follow_type'] = params.followType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/leads/${leadUniqueId}/follows`, { params: queryParams });
      return decodePageResult(response, leadFollowMapper);
    },

    async get(leadUniqueId: string, followUniqueId: string): Promise<LeadFollow> {
      const response = await transport.get<unknown>(`/leads/${leadUniqueId}/follows/${followUniqueId}`);
      return decodeOne(response, leadFollowMapper);
    },

    async create(leadUniqueId: string, data: CreateLeadFollowRequest): Promise<LeadFollow> {
      const response = await transport.post<unknown>(`/leads/${leadUniqueId}/follows`, {
        follow: {
          user_unique_id: data.userUniqueId,
          follow_type: data.followType,
          scheduled_at: data.scheduledAt?.toISOString(),
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, leadFollowMapper);
    },

    async update(leadUniqueId: string, followUniqueId: string, data: UpdateLeadFollowRequest): Promise<LeadFollow> {
      const response = await transport.put<unknown>(`/leads/${leadUniqueId}/follows/${followUniqueId}`, {
        follow: {
          follow_type: data.followType,
          scheduled_at: data.scheduledAt?.toISOString(),
          completed_at: data.completedAt?.toISOString(),
          notes: data.notes,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, leadFollowMapper);
    },

    async delete(leadUniqueId: string, followUniqueId: string): Promise<void> {
      await transport.delete(`/leads/${leadUniqueId}/follows/${followUniqueId}`);
    },
  };
}
