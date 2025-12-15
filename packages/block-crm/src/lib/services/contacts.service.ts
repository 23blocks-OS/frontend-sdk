import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ListContactsParams,
} from '../types/contact';
import { contactMapper } from '../mappers/contact.mapper';

export interface ContactsService {
  list(params?: ListContactsParams): Promise<PageResult<Contact>>;
  get(uniqueId: string): Promise<Contact>;
  create(data: CreateContactRequest): Promise<Contact>;
  update(uniqueId: string, data: UpdateContactRequest): Promise<Contact>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Contact>;
  search(query: string, params?: ListContactsParams): Promise<PageResult<Contact>>;
  listDeleted(params?: ListContactsParams): Promise<PageResult<Contact>>;
}

export function createContactsService(transport: Transport, _config: { appId: string }): ContactsService {
  return {
    async list(params?: ListContactsParams): Promise<PageResult<Contact>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.contactStatus) queryParams['contact_status'] = params.contactStatus;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/contacts', { params: queryParams });
      return decodePageResult(response, contactMapper);
    },

    async get(uniqueId: string): Promise<Contact> {
      const response = await transport.get<unknown>(`/contacts/${uniqueId}`);
      return decodeOne(response, contactMapper);
    },

    async create(data: CreateContactRequest): Promise<Contact> {
      const response = await transport.post<unknown>('/contacts', {
        contact: {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName,
          primary_email: data.primaryEmail,
          primary_phone: data.primaryPhone,
          position: data.position,
          notes: data.notes,
          source: data.source,
          user_unique_id: data.userUniqueId,
          tags: data.tags,
        },
      });
      return decodeOne(response, contactMapper);
    },

    async update(uniqueId: string, data: UpdateContactRequest): Promise<Contact> {
      const response = await transport.put<unknown>(`/contacts/${uniqueId}`, {
        contact: {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName,
          primary_email: data.primaryEmail,
          primary_phone: data.primaryPhone,
          position: data.position,
          notes: data.notes,
          contact_status: data.contactStatus,
          enabled: data.enabled,
          status: data.status,
          tags: data.tags,
        },
      });
      return decodeOne(response, contactMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/contacts/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Contact> {
      const response = await transport.put<unknown>(`/contacts/${uniqueId}/recover`, {});
      return decodeOne(response, contactMapper);
    },

    async search(query: string, params?: ListContactsParams): Promise<PageResult<Contact>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/contacts/search', { search: query }, { params: queryParams });
      return decodePageResult(response, contactMapper);
    },

    async listDeleted(params?: ListContactsParams): Promise<PageResult<Contact>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/contacts/trash/show', { params: queryParams });
      return decodePageResult(response, contactMapper);
    },
  };
}
