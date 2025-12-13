import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Opportunity,
  CreateOpportunityRequest,
  UpdateOpportunityRequest,
  ListOpportunitiesParams,
} from '../types/opportunity';
import { opportunityMapper } from '../mappers/opportunity.mapper';

export interface OpportunitiesService {
  list(params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>>;
  get(uniqueId: string): Promise<Opportunity>;
  create(data: CreateOpportunityRequest): Promise<Opportunity>;
  update(uniqueId: string, data: UpdateOpportunityRequest): Promise<Opportunity>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Opportunity>;
  search(query: string, params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>>;
  listDeleted(params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>>;
}

export function createOpportunitiesService(transport: Transport, _config: { appId: string }): OpportunitiesService {
  return {
    async list(params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.accountUniqueId) queryParams['account_unique_id'] = params.accountUniqueId;
      if (params?.contactUniqueId) queryParams['contact_unique_id'] = params.contactUniqueId;
      if (params?.ownerUniqueId) queryParams['owner_unique_id'] = params.ownerUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/opportunities', { params: queryParams });
      return decodePageResult(response, opportunityMapper);
    },

    async get(uniqueId: string): Promise<Opportunity> {
      const response = await transport.get<unknown>(`/opportunities/${uniqueId}`);
      return decodeOne(response, opportunityMapper);
    },

    async create(data: CreateOpportunityRequest): Promise<Opportunity> {
      const response = await transport.post<unknown>('/opportunities', {
        data: {
          type: 'Opportunity',
          attributes: {
            account_unique_id: data.accountUniqueId,
            contact_unique_id: data.contactUniqueId,
            code: data.code,
            name: data.name,
            notes: data.notes,
            budget: data.budget,
            total: data.total,
            duration: data.duration,
            duration_unit: data.durationUnit,
            duration_description: data.durationDescription,
            payload: data.payload,
            next_action_at: data.nextActionAt,
            owner_unique_id: data.ownerUniqueId,
            tags: data.tags,
          },
        },
      });
      return decodeOne(response, opportunityMapper);
    },

    async update(uniqueId: string, data: UpdateOpportunityRequest): Promise<Opportunity> {
      const response = await transport.put<unknown>(`/opportunities/${uniqueId}`, {
        data: {
          type: 'Opportunity',
          attributes: {
            name: data.name,
            notes: data.notes,
            budget: data.budget,
            total: data.total,
            duration: data.duration,
            duration_unit: data.durationUnit,
            duration_description: data.durationDescription,
            payload: data.payload,
            next_action_at: data.nextActionAt,
            owner_unique_id: data.ownerUniqueId,
            owner_name: data.ownerName,
            owner_email: data.ownerEmail,
            enabled: data.enabled,
            status: data.status,
            tags: data.tags,
          },
        },
      });
      return decodeOne(response, opportunityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/opportunities/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Opportunity> {
      const response = await transport.put<unknown>(`/opportunities/${uniqueId}/recover`, {});
      return decodeOne(response, opportunityMapper);
    },

    async search(query: string, params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/opportunities/search', { search: query }, { params: queryParams });
      return decodePageResult(response, opportunityMapper);
    },

    async listDeleted(params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/opportunities/trash/show', { params: queryParams });
      return decodePageResult(response, opportunityMapper);
    },
  };
}
