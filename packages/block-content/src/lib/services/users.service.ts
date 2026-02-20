import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ContentUser,
  Following,
  RegisterContentUserRequest,
  UpdateContentUserRequest,
  ListContentUsersParams,
  UserActivity,
} from '../types/user.js';
import type { Post } from '../types/post.js';
import type { Comment } from '../types/comment.js';
import { contentUserMapper, followingMapper } from '../mappers/user.mapper.js';
import { postMapper } from '../mappers/post.mapper.js';
import { commentMapper } from '../mappers/comment.mapper.js';

export interface ContentUsersService {
  /**
   * List all content users
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of ContentUser records with pagination metadata
   */
  list(params?: ListContentUsersParams): Promise<PageResult<ContentUser>>;

  /**
   * Get a content user by unique ID
   * @param uniqueId - Unique ID of the user to retrieve
   * @returns The matching ContentUser record
   */
  get(uniqueId: string): Promise<ContentUser>;

  /**
   * Register a user in the content system
   * @param uniqueId - Unique ID of the user to register
   * @param data - Registration payload with profile details
   * @returns The newly registered ContentUser record
   */
  register(uniqueId: string, data: RegisterContentUserRequest): Promise<ContentUser>;

  /**
   * Update a content user's profile
   * @param uniqueId - Unique ID of the user to update
   * @param data - Fields to update on the user profile
   * @returns The updated ContentUser record
   */
  update(uniqueId: string, data: UpdateContentUserRequest): Promise<ContentUser>;

  // User content

  /**
   * Get a user's draft posts
   * @param uniqueId - Unique ID of the user
   * @returns Array of draft Post records
   */
  getDrafts(uniqueId: string): Promise<Post[]>;

  /**
   * Get a user's published posts
   * @param uniqueId - Unique ID of the user
   * @returns Array of Post records
   */
  getPosts(uniqueId: string): Promise<Post[]>;

  /**
   * Get a user's comments
   * @param uniqueId - Unique ID of the user
   * @returns Array of Comment records
   */
  getComments(uniqueId: string): Promise<Comment[]>;

  /**
   * Get a user's activity history
   * @param uniqueId - Unique ID of the user
   * @returns Array of UserActivity records with activity type, target, and timestamp
   */
  getActivities(uniqueId: string): Promise<UserActivity[]>;

  // Tags

  /**
   * Add a tag to a content user
   * @param uniqueId - Unique ID of the user
   * @param tagUniqueId - Unique ID of the tag to add
   * @returns The updated ContentUser record
   */
  addTag(uniqueId: string, tagUniqueId: string): Promise<ContentUser>;

  /**
   * Remove a tag from a content user
   * @param uniqueId - Unique ID of the user
   * @param tagUniqueId - Unique ID of the tag to remove
   * @returns void on successful removal
   */
  removeTag(uniqueId: string, tagUniqueId: string): Promise<void>;

  // Social

  /**
   * Get a user's followers
   * @param uniqueId - Unique ID of the user
   * @returns Array of Following records with full relationship data
   */
  getFollowers(uniqueId: string): Promise<Following[]>;

  /**
   * Get users that a user is following
   * @param uniqueId - Unique ID of the user
   * @returns Array of Following records with full relationship data
   */
  getFollowing(uniqueId: string): Promise<Following[]>;

  /**
   * Follow another user
   * @param uniqueId - Unique ID of the current user
   * @param targetUserUniqueId - Unique ID of the user to follow
   * @returns void on successful follow
   */
  followUser(uniqueId: string, targetUserUniqueId: string): Promise<void>;

  /**
   * Unfollow another user
   * @param uniqueId - Unique ID of the current user
   * @param targetUserUniqueId - Unique ID of the user to unfollow
   * @returns void on successful unfollow
   */
  unfollowUser(uniqueId: string, targetUserUniqueId: string): Promise<void>;
}

export function createContentUsersService(transport: Transport, _config: { apiKey: string }): ContentUsersService {
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
