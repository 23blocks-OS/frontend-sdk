import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  JarvisUser,
  RegisterJarvisUserRequest,
  UpdateJarvisUserRequest,
  ListJarvisUsersParams,
  CreateContextRequest,
  SendMessageRequest,
} from '../types/user.js';
import { jarvisUserMapper } from '../mappers/user.mapper.js';
import { buildContextBody, buildMessageBody } from './entities.service.js';

function buildUserBody(data: RegisterJarvisUserRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.firstName) body['first_name'] = data.firstName;
  if (data.lastName) body['last_name'] = data.lastName;
  if (data.email) body['email'] = data.email;
  if (data.phone) body['phone'] = data.phone;
  if (data.avatarUrl) body['avatar_url'] = data.avatarUrl;
  if (data.roleName) body['role_name'] = data.roleName;
  if (data.roleUniqueId) body['role_unique_id'] = data.roleUniqueId;
  if (data.timeZone) body['time_zone'] = data.timeZone;
  if (data.preferredLanguage) body['preferred_language'] = data.preferredLanguage;
  if (data.maxFileSize !== undefined) body['max_file_size'] = data.maxFileSize;
  if (data.maxStorage !== undefined) body['max_storage'] = data.maxStorage;
  return body;
}

export interface JarvisUsersService {
  list(params?: ListJarvisUsersParams): Promise<PageResult<JarvisUser>>;
  get(uniqueId: string): Promise<JarvisUser>;
  register(uniqueId: string, data?: RegisterJarvisUserRequest): Promise<JarvisUser>;
  update(uniqueId: string, data: UpdateJarvisUserRequest): Promise<JarvisUser>;
  addPrompt(uniqueId: string, promptUniqueId: string): Promise<void>;
  createContext(uniqueId: string, data?: CreateContextRequest): Promise<unknown>;
  sendMessage(uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<unknown>;
}

export function createJarvisUsersService(transport: Transport, _config: { appId: string }): JarvisUsersService {
  return {
    async list(params?: ListJarvisUsersParams): Promise<PageResult<JarvisUser>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/identities', { params: queryParams });
      return decodePageResult(response, jarvisUserMapper);
    },

    async get(uniqueId: string): Promise<JarvisUser> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}`);
      return decodeOne(response, jarvisUserMapper);
    },

    async register(uniqueId: string, data?: RegisterJarvisUserRequest): Promise<JarvisUser> {
      const response = await transport.post<unknown>(`/identities/${uniqueId}/register`, {
        user: data ? buildUserBody(data) : {},
      });
      return decodeOne(response, jarvisUserMapper);
    },

    async update(uniqueId: string, data: UpdateJarvisUserRequest): Promise<JarvisUser> {
      const response = await transport.put<unknown>(`/identities/${uniqueId}`, {
        user: buildUserBody(data),
      });
      return decodeOne(response, jarvisUserMapper);
    },

    async addPrompt(uniqueId: string, promptUniqueId: string): Promise<void> {
      await transport.post(`/identities/${uniqueId}/add_prompt`, {
        prompt: { unique_id: promptUniqueId },
      });
    },

    async createContext(uniqueId: string, data?: CreateContextRequest): Promise<unknown> {
      return transport.post(`/identities/${uniqueId}/create_context`, {
        context: data ? buildContextBody(data) : {},
      });
    },

    async sendMessage(uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<unknown> {
      return transport.post(`/identities/${uniqueId}/contexts/${contextUniqueId}/send_message`, {
        message: buildMessageBody(data),
      });
    },
  };
}
