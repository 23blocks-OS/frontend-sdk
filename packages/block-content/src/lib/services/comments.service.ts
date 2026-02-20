import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  ListCommentsParams,
} from '../types/comment.js';
import { commentMapper } from '../mappers/comment.mapper.js';

export interface CommentsService {
  /**
   * List comments for a post
   * @param postUniqueId - Unique ID of the post to list comments for
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of Comment records with pagination metadata
   */
  list(postUniqueId: string, params?: ListCommentsParams): Promise<PageResult<Comment>>;

  /**
   * Get a specific comment
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to retrieve
   * @returns The matching Comment record
   */
  get(postUniqueId: string, uniqueId: string): Promise<Comment>;

  /**
   * Create a new comment on a post
   * @param postUniqueId - Unique ID of the post to comment on
   * @param data - Comment creation payload
   * @returns The newly created Comment record
   */
  create(postUniqueId: string, data: CreateCommentRequest): Promise<Comment>;

  /**
   * Update a comment
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to update
   * @param data - Fields to update on the comment
   * @returns The updated Comment record
   */
  update(postUniqueId: string, uniqueId: string, data: UpdateCommentRequest): Promise<Comment>;

  /**
   * Delete a comment
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to delete
   * @returns void on successful deletion
   */
  delete(postUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Reply to a comment (creates a nested comment)
   * @param postUniqueId - Unique ID of the parent post
   * @param parentCommentUniqueId - Unique ID of the comment being replied to
   * @param data - Reply content (parentId is set automatically from parentCommentUniqueId)
   * @returns The newly created reply Comment record
   * @note The parentId field is omitted from the request since it is derived from parentCommentUniqueId
   */
  reply(postUniqueId: string, parentCommentUniqueId: string, data: Omit<CreateCommentRequest, 'parentId'>): Promise<Comment>;

  /**
   * Like a comment
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to like
   * @returns The updated Comment record with engagement state
   */
  like(postUniqueId: string, uniqueId: string): Promise<Comment>;

  /**
   * Dislike a comment
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to dislike
   * @returns The updated Comment record with engagement state
   */
  dislike(postUniqueId: string, uniqueId: string): Promise<Comment>;

  /**
   * Save a comment to the user's saved items
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to save
   * @returns The updated Comment record with engagement state
   */
  save(postUniqueId: string, uniqueId: string): Promise<Comment>;

  /**
   * Remove a comment from the user's saved items
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to unsave
   * @returns The updated Comment record with engagement state
   */
  unsave(postUniqueId: string, uniqueId: string): Promise<Comment>;

  /**
   * Follow a comment to receive notifications on updates
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to follow
   * @returns The updated Comment record with engagement state
   */
  follow(postUniqueId: string, uniqueId: string): Promise<Comment>;

  /**
   * Unfollow a comment to stop receiving notifications
   * @param postUniqueId - Unique ID of the parent post
   * @param uniqueId - Unique ID of the comment to unfollow
   * @returns The updated Comment record with engagement state
   */
  unfollow(postUniqueId: string, uniqueId: string): Promise<Comment>;
}

export function createCommentsService(transport: Transport, _config: { apiKey: string }): CommentsService {
  return {
    async list(postUniqueId: string, params?: ListCommentsParams): Promise<PageResult<Comment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.parentId) queryParams['parent_id'] = params.parentId;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>(`/posts/${postUniqueId}/comments`, { params: queryParams });
      return decodePageResult(response, commentMapper);
    },

    async get(postUniqueId: string, uniqueId: string): Promise<Comment> {
      const response = await transport.get<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}`);
      return decodeOne(response, commentMapper);
    },

    async create(postUniqueId: string, data: CreateCommentRequest): Promise<Comment> {
      const response = await transport.post<unknown>(`/posts/${postUniqueId}/comments`, {
        comment: {
          content: data.content,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          parent_id: data.parentId,
          payload: data.payload,
        },
      });
      return decodeOne(response, commentMapper);
    },

    async update(postUniqueId: string, uniqueId: string, data: UpdateCommentRequest): Promise<Comment> {
      const response = await transport.put<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}`, {
        comment: {
          content: data.content,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, commentMapper);
    },

    async delete(postUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/posts/${postUniqueId}/comments/${uniqueId}`);
    },

    async reply(postUniqueId: string, parentCommentUniqueId: string, data: Omit<CreateCommentRequest, 'parentId'>): Promise<Comment> {
      const response = await transport.post<unknown>(`/posts/${postUniqueId}/comments/${parentCommentUniqueId}/reply`, {
        comment: {
          content: data.content,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, commentMapper);
    },

    // Engagement
    async like(postUniqueId: string, uniqueId: string): Promise<Comment> {
      const response = await transport.put<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}/like`, {});
      return decodeOne(response, commentMapper);
    },

    async dislike(postUniqueId: string, uniqueId: string): Promise<Comment> {
      const response = await transport.put<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}/dislike`, {});
      return decodeOne(response, commentMapper);
    },

    async save(postUniqueId: string, uniqueId: string): Promise<Comment> {
      const response = await transport.put<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}/save`, {});
      return decodeOne(response, commentMapper);
    },

    async unsave(postUniqueId: string, uniqueId: string): Promise<Comment> {
      const response = await transport.delete<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}/unsave`);
      return decodeOne(response, commentMapper);
    },

    async follow(postUniqueId: string, uniqueId: string): Promise<Comment> {
      const response = await transport.put<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}/follow`, {});
      return decodeOne(response, commentMapper);
    },

    async unfollow(postUniqueId: string, uniqueId: string): Promise<Comment> {
      const response = await transport.delete<unknown>(`/posts/${postUniqueId}/comments/${uniqueId}/unfollow`);
      return decodeOne(response, commentMapper);
    },
  };
}
