import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { CrmUser, RegisterCrmUserRequest, ListCrmUsersParams } from '../types/user.js';
import type { Contact } from '../types/contact.js';
import type { Meeting } from '../types/meeting.js';
import { crmUserMapper } from '../mappers/user.mapper.js';
import { contactMapper } from '../mappers/contact.mapper.js';
import { meetingMapper } from '../mappers/meeting.mapper.js';

export interface CrmUsersService {
  /**
   * List CRM users with optional filtering and pagination.
   * @param params - Optional filtering (status, search) and pagination parameters.
   * @returns Paginated result containing CrmUser objects and metadata.
   */
  list(params?: ListCrmUsersParams): Promise<PageResult<CrmUser>>;

  /**
   * Retrieve a single CRM user by their unique identifier.
   * @param uniqueId - The unique identifier of the CRM user.
   * @returns The matching CrmUser object.
   */
  get(uniqueId: string): Promise<CrmUser>;

  /**
   * Register a user in the CRM system.
   * @param uniqueId - The unique identifier of the user to register.
   * @param data - The registration payload with email, name, phone, and optional payload.
   * @returns The newly registered CrmUser object.
   * @note This associates an existing authentication user with the CRM block.
   */
  register(uniqueId: string, data: RegisterCrmUserRequest): Promise<CrmUser>;

  /**
   * Delete a CRM user.
   * @param uniqueId - The unique identifier of the CRM user to delete.
   * @returns Resolves when the CRM user has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Retrieve all contacts assigned to a CRM user.
   * @param uniqueId - The unique identifier of the CRM user.
   * @returns An array of Contact objects assigned to the user.
   */
  getContacts(uniqueId: string): Promise<Contact[]>;

  /**
   * Retrieve all meetings associated with a CRM user.
   * @param uniqueId - The unique identifier of the CRM user.
   * @returns An array of Meeting objects associated with the user.
   */
  getMeetings(uniqueId: string): Promise<Meeting[]>;
}

export function createCrmUsersService(transport: Transport, _config: { apiKey: string }): CrmUsersService {
  return {
    async list(params?: ListCrmUsersParams): Promise<PageResult<CrmUser>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/users', { params: queryParams });
      return decodePageResult(response, crmUserMapper);
    },

    async get(uniqueId: string): Promise<CrmUser> {
      const response = await transport.get<unknown>(`/users/${uniqueId}`);
      return decodeOne(response, crmUserMapper);
    },

    async register(uniqueId: string, data: RegisterCrmUserRequest): Promise<CrmUser> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/register`, {
        user: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          payload: data.payload,
        },
      });
      return decodeOne(response, crmUserMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/users/${uniqueId}`);
    },

    async getContacts(uniqueId: string): Promise<Contact[]> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/contacts`);
      return decodeMany(response, contactMapper);
    },

    async getMeetings(uniqueId: string): Promise<Meeting[]> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/meetings`);
      return decodeMany(response, meetingMapper);
    },
  };
}
