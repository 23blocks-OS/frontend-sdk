import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { CrmUser, RegisterCrmUserRequest, ListCrmUsersParams } from '../types/user';
import type { Contact } from '../types/contact';
import type { Meeting } from '../types/meeting';
import { crmUserMapper } from '../mappers/user.mapper';
import { contactMapper } from '../mappers/contact.mapper';
import { meetingMapper } from '../mappers/meeting.mapper';

export interface CrmUsersService {
  list(params?: ListCrmUsersParams): Promise<PageResult<CrmUser>>;
  get(uniqueId: string): Promise<CrmUser>;
  register(uniqueId: string, data: RegisterCrmUserRequest): Promise<CrmUser>;
  delete(uniqueId: string): Promise<void>;
  getContacts(uniqueId: string): Promise<Contact[]>;
  getMeetings(uniqueId: string): Promise<Meeting[]>;
}

export function createCrmUsersService(transport: Transport, _config: { appId: string }): CrmUsersService {
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
