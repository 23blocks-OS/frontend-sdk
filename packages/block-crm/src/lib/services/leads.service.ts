import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  ListLeadsParams,
} from '../types/lead';
import { leadMapper } from '../mappers/lead.mapper';

export interface LeadsService {
  list(params?: ListLeadsParams): Promise<PageResult<Lead>>;
  get(uniqueId: string): Promise<Lead>;
  create(data: CreateLeadRequest): Promise<Lead>;
  update(uniqueId: string, data: UpdateLeadRequest): Promise<Lead>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Lead>;
  search(query: string, params?: ListLeadsParams): Promise<PageResult<Lead>>;
  listDeleted(params?: ListLeadsParams): Promise<PageResult<Lead>>;
}

export function createLeadsService(transport: Transport, _config: { appId: string }): LeadsService {
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
        data: {
          type: 'Lead',
          attributes: {
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
        },
      });
      return decodeOne(response, leadMapper);
    },

    async update(uniqueId: string, data: UpdateLeadRequest): Promise<Lead> {
      const response = await transport.put<unknown>(`/leads/${uniqueId}`, {
        data: {
          type: 'Lead',
          attributes: {
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
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/leads/search', { search: query }, { params: queryParams });
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
