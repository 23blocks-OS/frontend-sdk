import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  ListLeadsParams,
} from '../types/lead.js';
import { leadMapper } from '../mappers/lead.mapper.js';

export interface LeadsService {
  /**
   * List leads with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, contactStatus, source, search), pagination, and sorting parameters.
   * @returns Paginated result containing Lead objects and metadata.
   */
  list(params?: ListLeadsParams): Promise<PageResult<Lead>>;

  /**
   * Retrieve a single lead by its unique identifier.
   * @param uniqueId - The unique identifier of the lead.
   * @returns The matching Lead object.
   */
  get(uniqueId: string): Promise<Lead>;

  /**
   * Create a new lead.
   * @param data - The lead creation payload with name, email, social profiles, and other fields.
   * @returns The newly created Lead object.
   */
  create(data: CreateLeadRequest): Promise<Lead>;

  /**
   * Update an existing lead.
   * @param uniqueId - The unique identifier of the lead to update.
   * @param data - The fields to update on the lead.
   * @returns The updated Lead object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateLeadRequest): Promise<Lead>;

  /**
   * Soft-delete a lead.
   * @param uniqueId - The unique identifier of the lead to delete.
   * @returns Resolves when the lead has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted lead.
   * @param uniqueId - The unique identifier of the lead to recover.
   * @returns The recovered Lead object.
   */
  recover(uniqueId: string): Promise<Lead>;

  /**
   * Search leads by a query string with optional pagination.
   * @param query - The search query string.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing matching Lead objects.
   * @note Performs a server-side POST-based search.
   */
  search(query: string, params?: ListLeadsParams): Promise<PageResult<Lead>>;

  /**
   * List soft-deleted leads with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing soft-deleted Lead objects.
   */
  listDeleted(params?: ListLeadsParams): Promise<PageResult<Lead>>;
}

export function createLeadsService(transport: Transport, _config: { apiKey: string }): LeadsService {
  return {
    async list(params?: ListLeadsParams): Promise<PageResult<Lead>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.contactStatus) queryParams['contact_status'] = params.contactStatus;
      if (params?.source) queryParams['source'] = params.source;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/leads', { params: queryParams });
      return decodePageResult(response, leadMapper);
    },

    async get(uniqueId: string): Promise<Lead> {
      const response = await transport.get<unknown>(`/leads/${uniqueId}`);
      return decodeOne(response, leadMapper);
    },

    async create(data: CreateLeadRequest): Promise<Lead> {
      const response = await transport.post<unknown>('/leads', {
        lead: {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName,
          lead_email: data.leadEmail,
          phone_number: data.phoneNumber,
          web_site: data.webSite,
          twitter: data.twitter,
          fb: data.fb,
          instagram: data.instagram,
          linkedin: data.linkedin,
          youtube: data.youtube,
          blog: data.blog,
          notes: data.notes,
          source: data.source,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return decodeOne(response, leadMapper);
    },

    async update(uniqueId: string, data: UpdateLeadRequest): Promise<Lead> {
      const response = await transport.put<unknown>(`/leads/${uniqueId}`, {
        lead: {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName,
          lead_email: data.leadEmail,
          phone_number: data.phoneNumber,
          web_site: data.webSite,
          twitter: data.twitter,
          fb: data.fb,
          instagram: data.instagram,
          linkedin: data.linkedin,
          youtube: data.youtube,
          blog: data.blog,
          notes: data.notes,
          contact_status: data.contactStatus,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return decodeOne(response, leadMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/leads/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Lead> {
      const response = await transport.put<unknown>(`/leads/${uniqueId}/recover`, {});
      return decodeOne(response, leadMapper);
    },

    async search(query: string, params?: ListLeadsParams): Promise<PageResult<Lead>> {
      // CRM API doesn't expose POST /leads/search — search is a query-string
      // filter on the index endpoint. Confirmed by api-crm in msg_1780362274.
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/leads', { params: queryParams });
      return decodePageResult(response, leadMapper);
    },

    async listDeleted(params?: ListLeadsParams): Promise<PageResult<Lead>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/leads/trash/show', { params: queryParams });
      return decodePageResult(response, leadMapper);
    },
  };
}
