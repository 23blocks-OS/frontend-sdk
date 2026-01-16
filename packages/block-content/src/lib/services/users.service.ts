import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ContentUser,
  Following,
  RegisterContentUserRequest,
  UpdateContentUserRequest,
  ListContentUsersParams,
  UserActivity,
} from '../types/user';
import type { Post } from '../types/post';
import type { Comment } from '../types/comment';
import { contentUserMapper, followingMapper } from '../mappers/user.mapper';
import { postMapper } from '../mappers/post.mapper';
import { commentMapper } from '../mappers/comment.mapper';

export interface ContentUsersService {
  list(params?: ListContentUsersParams): Promise<PageResult<ContentUser>>;
  get(uniqueId: string): Promise<ContentUser>;
  register(uniqueId: string, data: RegisterContentUserRequest): Promise<ContentUser>;
  update(uniqueId: string, data: UpdateContentUserRequest): Promise<ContentUser>;

  // User content
  getDrafts(uniqueId: string): Promise<Post[]>;
  getPosts(uniqueId: string): Promise<Post[]>;
  getComments(uniqueId: string): Promise<Comment[]>;
  getActivities(uniqueId: string): Promise<UserActivity[]>;

  // Tags
  addTag(uniqueId: string, tagUniqueId: string): Promise<ContentUser>;
  removeTag(uniqueId: string, tagUniqueId: string): Promise<void>;

  // Social - returns Following[] with full relationship data
  getFollowers(uniqueId: string): Promise<Following[]>;
  getFollowing(uniqueId: string): Promise<Following[]>;
  followUser(uniqueId: string, targetUserUniqueId: string): Promise<void>;
  unfollowUser(uniqueId: string, targetUserUniqueId: string): Promise<void>;
}

export function createContentUsersService(transport: Transport, _config: { appId: string }): ContentUsersService {
  return {
    async list(params?: ListContentUsersParams): Promise<PageResult<ContentUser>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/identities', { params: queryParams });
      return decodePageResult(response, contentUserMapper);
    },

    async get(uniqueId: string): Promise<ContentUser> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}`);
      return decodeOne(response, contentUserMapper);
    },

    async register(uniqueId: string, data: RegisterContentUserRequest): Promise<ContentUser> {
      const response = await transport.post<unknown>(`/identities/${uniqueId}/register`, {
        user: {
          email: data.email,
          name: data.name,
          first_name: data.firstName,
          last_name: data.lastName,
          avatar_url: data.avatarUrl,
          bio: data.bio,
          phone: data.phone,
          time_zone: data.timeZone,
          preferred_language: data.preferredLanguage,
          payload: data.payload,
        },
      });
      return decodeOne(response, contentUserMapper);
    },

    async update(uniqueId: string, data: UpdateContentUserRequest): Promise<ContentUser> {
      const response = await transport.put<unknown>(`/identities/${uniqueId}`, {
        user: {
          name: data.name,
          first_name: data.firstName,
          last_name: data.lastName,
          avatar_url: data.avatarUrl,
          bio: data.bio,
          phone: data.phone,
          time_zone: data.timeZone,
          preferred_language: data.preferredLanguage,
          email_notifications: data.emailNotifications,
          sms_notifications: data.smsNotifications,
          whatsapp_notifications: data.whatsappNotifications,
          other_notifications: data.otherNotifications,
          payload: data.payload,
        },
      });
      return decodeOne(response, contentUserMapper);
    },

    async getDrafts(uniqueId: string): Promise<Post[]> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}/drafts`);
      return decodeMany(response, postMapper);
    },

    async getPosts(uniqueId: string): Promise<Post[]> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}/posts`);
      return decodeMany(response, postMapper);
    },

    async getComments(uniqueId: string): Promise<Comment[]> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}/comments`);
      return decodeMany(response, commentMapper);
    },

    async getActivities(uniqueId: string): Promise<UserActivity[]> {
      const response = await transport.get<{ data: Array<Record<string, unknown>> }>(`/identities/${uniqueId}/activities`);
      return (response.data || []).map((item: Record<string, unknown>) => ({
        uniqueId: String(item['unique_id'] ?? ''),
        activityType: String(item['activity_type'] ?? ''),
        targetType: String(item['target_type'] ?? ''),
        targetUniqueId: String(item['target_unique_id'] ?? ''),
        description: item['description'] as string | undefined,
        createdAt: new Date(item['created_at'] as string),
        payload: item['payload'] as Record<string, unknown> | undefined,
      }));
    },

    async addTag(uniqueId: string, tagUniqueId: string): Promise<ContentUser> {
      const response = await transport.post<unknown>(`/identities/${uniqueId}/tags`, {
        tag: { unique_id: tagUniqueId },
      });
      return decodeOne(response, contentUserMapper);
    },

    async removeTag(uniqueId: string, tagUniqueId: string): Promise<void> {
      await transport.delete(`/identities/${uniqueId}/tags/${tagUniqueId}`);
    },

    async getFollowers(uniqueId: string): Promise<Following[]> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}/followers`);
      return decodeMany(response, followingMapper);
    },

    async getFollowing(uniqueId: string): Promise<Following[]> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}/following`);
      return decodeMany(response, followingMapper);
    },

    async followUser(uniqueId: string, targetUserUniqueId: string): Promise<void> {
      await transport.post(`/identities/${uniqueId}/follows/${targetUserUniqueId}`, {});
    },

    async unfollowUser(uniqueId: string, targetUserUniqueId: string): Promise<void> {
      await transport.delete(`/identities/${uniqueId}/unfollows/${targetUserUniqueId}`);
    },
  };
}
