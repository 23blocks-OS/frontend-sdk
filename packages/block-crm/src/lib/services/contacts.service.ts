import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
  ListContactsParams,
} from '../types/contact.js';
import { contactMapper } from '../mappers/contact.mapper.js';

export interface ContactsService {
  /**
   * List contacts with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, contactStatus, search), pagination, and sorting parameters.
   * @returns Paginated result containing Contact objects and metadata.
   */
  list(params?: ListContactsParams): Promise<PageResult<Contact>>;

  /**
   * Retrieve a single contact by its unique identifier.
   * @param uniqueId - The unique identifier of the contact.
   * @returns The matching Contact object.
   */
  get(uniqueId: string): Promise<Contact>;

  /**
   * Create a new contact.
   * @param data - The contact creation payload with name, email, phone, and other fields.
   * @returns The newly created Contact object.
   */
  create(data: CreateContactRequest): Promise<Contact>;

  /**
   * Update an existing contact.
   * @param uniqueId - The unique identifier of the contact to update.
   * @param data - The fields to update on the contact.
   * @returns The updated Contact object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateContactRequest): Promise<Contact>;

  /**
   * Soft-delete a contact.
   * @param uniqueId - The unique identifier of the contact to delete.
   * @returns Resolves when the contact has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted contact.
   * @param uniqueId - The unique identifier of the contact to recover.
   * @returns The recovered Contact object.
   */
  recover(uniqueId: string): Promise<Contact>;

  /**
   * Search contacts by a query string with optional pagination.
   * @param query - The search query string.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing matching Contact objects.
   * @note Performs a server-side POST-based search.
   */
  search(query: string, params?: ListContactsParams): Promise<PageResult<Contact>>;

  /**
   * List soft-deleted contacts with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing soft-deleted Contact objects.
   */
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
