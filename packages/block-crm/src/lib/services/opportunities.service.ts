import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Opportunity,
  CreateOpportunityRequest,
  UpdateOpportunityRequest,
  ListOpportunitiesParams,
} from '../types/opportunity.js';
import { opportunityMapper } from '../mappers/opportunity.mapper.js';

export interface OpportunitiesService {
  /**
   * List opportunities with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, accountUniqueId, contactUniqueId, ownerUniqueId, search), pagination, and sorting.
   * @returns Paginated result containing Opportunity objects and metadata.
   */
  list(params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>>;

  /**
   * Retrieve a single opportunity by its unique identifier.
   * @param uniqueId - The unique identifier of the opportunity.
   * @returns The matching Opportunity object.
   */
  get(uniqueId: string): Promise<Opportunity>;

  /**
   * Create a new opportunity.
   * @param data - The opportunity creation payload with account, contact, budget, duration, and other fields.
   * @returns The newly created Opportunity object.
   */
  create(data: CreateOpportunityRequest): Promise<Opportunity>;

  /**
   * Update an existing opportunity.
   * @param uniqueId - The unique identifier of the opportunity to update.
   * @param data - The fields to update on the opportunity.
   * @returns The updated Opportunity object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateOpportunityRequest): Promise<Opportunity>;

  /**
   * Soft-delete an opportunity.
   * @param uniqueId - The unique identifier of the opportunity to delete.
   * @returns Resolves when the opportunity has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted opportunity.
   * @param uniqueId - The unique identifier of the opportunity to recover.
   * @returns The recovered Opportunity object.
   */
  recover(uniqueId: string): Promise<Opportunity>;

  /**
   * Search opportunities by a query string with optional pagination.
   * @param query - The search query string.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing matching Opportunity objects.
   * @note Performs a server-side POST-based search.
   */
  search(query: string, params?: ListOpportunitiesParams): Promise<PageResult<Opportunity>>;

  /**
   * List soft-deleted opportunities with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing soft-deleted Opportunity objects.
   */
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
        opportunity: {
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
      });
      return decodeOne(response, opportunityMapper);
    },

    async update(uniqueId: string, data: UpdateOpportunityRequest): Promise<Opportunity> {
      const response = await transport.put<unknown>(`/opportunities/${uniqueId}`, {
        opportunity: {
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
