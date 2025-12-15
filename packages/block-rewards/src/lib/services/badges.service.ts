import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Badge,
  UserBadge,
  CreateBadgeRequest,
  UpdateBadgeRequest,
  ListBadgesParams,
  AwardBadgeRequest,
  ListUserBadgesParams,
} from '../types/badge';
import { badgeMapper, userBadgeMapper } from '../mappers/badge.mapper';

export interface BadgesService {
  list(params?: ListBadgesParams): Promise<PageResult<Badge>>;
  get(uniqueId: string): Promise<Badge>;
  create(data: CreateBadgeRequest): Promise<Badge>;
  update(uniqueId: string, data: UpdateBadgeRequest): Promise<Badge>;
  delete(uniqueId: string): Promise<void>;
  award(data: AwardBadgeRequest): Promise<UserBadge>;
  listByUser(userUniqueId: string, params?: ListUserBadgesParams): Promise<PageResult<UserBadge>>;
}

export function createBadgesService(transport: Transport, _config: { appId: string }): BadgesService {
  return {
    async list(params?: ListBadgesParams): Promise<PageResult<Badge>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/badges', { params: queryParams });
      return decodePageResult(response, badgeMapper);
    },

    async get(uniqueId: string): Promise<Badge> {
      const response = await transport.get<unknown>(`/badges/${uniqueId}`);
      return decodeOne(response, badgeMapper);
    },

    async create(data: CreateBadgeRequest): Promise<Badge> {
      const response = await transport.post<unknown>('/badges', {
        badge: {
            code: data.code,
            name: data.name,
            description: data.description,
            image_url: data.imageUrl,
            criteria: data.criteria,
            payload: data.payload,
          },
      });
      return decodeOne(response, badgeMapper);
    },

    async update(uniqueId: string, data: UpdateBadgeRequest): Promise<Badge> {
      const response = await transport.put<unknown>(`/badges/${uniqueId}`, {
        badge: {
            name: data.name,
            description: data.description,
            image_url: data.imageUrl,
            criteria: data.criteria,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, badgeMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/badges/${uniqueId}`);
    },

    async award(data: AwardBadgeRequest): Promise<UserBadge> {
      const response = await transport.post<unknown>('/badges/award', {
        userbadge: {
            badge_unique_id: data.badgeUniqueId,
            user_unique_id: data.userUniqueId,
            reason: data.reason,
            metadata: data.metadata,
          },
      });
      return decodeOne(response, userBadgeMapper);
    },

    async listByUser(userUniqueId: string, params?: ListUserBadgesParams): Promise<PageResult<UserBadge>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/badges`, { params: queryParams });
      return decodePageResult(response, userBadgeMapper);
    },
  };
}
