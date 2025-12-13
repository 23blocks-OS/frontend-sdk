import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  UserIdentity,
  CreateUserIdentityRequest,
  VerifyUserIdentityRequest,
  ListUserIdentitiesParams,
} from '../types/user-identity';
import { userIdentityMapper } from '../mappers/user-identity.mapper';

export interface UserIdentitiesService {
  list(params?: ListUserIdentitiesParams): Promise<PageResult<UserIdentity>>;
  get(uniqueId: string): Promise<UserIdentity>;
  create(data: CreateUserIdentityRequest): Promise<UserIdentity>;
  verify(uniqueId: string, data: VerifyUserIdentityRequest): Promise<UserIdentity>;
  delete(uniqueId: string): Promise<void>;
  listByUser(userUniqueId: string): Promise<UserIdentity[]>;
}

export function createUserIdentitiesService(transport: Transport, _config: { appId: string }): UserIdentitiesService {
  return {
    async list(params?: ListUserIdentitiesParams): Promise<PageResult<UserIdentity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.identityType) queryParams['identity_type'] = params.identityType;
      if (params?.verified !== undefined) queryParams['verified'] = String(params.verified);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/user_identities', { params: queryParams });
      return decodePageResult(response, userIdentityMapper);
    },

    async get(uniqueId: string): Promise<UserIdentity> {
      const response = await transport.get<unknown>(`/user_identities/${uniqueId}`);
      return decodeOne(response, userIdentityMapper);
    },

    async create(data: CreateUserIdentityRequest): Promise<UserIdentity> {
      const response = await transport.post<unknown>('/user_identities', {
        data: {
          type: 'UserIdentity',
          attributes: {
            user_unique_id: data.userUniqueId,
            identity_type: data.identityType,
            identity_value: data.identityValue,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, userIdentityMapper);
    },

    async verify(uniqueId: string, data: VerifyUserIdentityRequest): Promise<UserIdentity> {
      const response = await transport.post<unknown>(`/user_identities/${uniqueId}/verify`, {
        data: {
          type: 'UserIdentity',
          attributes: {
            verification_code: data.verificationCode,
            verification_data: data.verificationData,
          },
        },
      });
      return decodeOne(response, userIdentityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/user_identities/${uniqueId}`);
    },

    async listByUser(userUniqueId: string): Promise<UserIdentity[]> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/identities`);
      return decodeMany(response, userIdentityMapper);
    },
  };
}
