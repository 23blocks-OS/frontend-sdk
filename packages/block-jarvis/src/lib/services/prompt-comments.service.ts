import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PromptComment,
  CreatePromptCommentRequest,
  UpdatePromptCommentRequest,
  ListPromptCommentsParams,
  ReplyToCommentRequest,
} from '../types/comment.js';
import { promptCommentMapper } from '../mappers/comment.mapper.js';

export interface PromptCommentsService {
  /**
   * List comments on a prompt with optional filtering and sorting.
   * @returns Paginated list of PromptComment records with metadata.
   */
  list(promptUniqueId: string, params?: ListPromptCommentsParams): Promise<PageResult<PromptComment>>;

  /**
   * Get a single prompt comment by unique ID.
   * @returns The matching PromptComment record.
   */
  get(promptUniqueId: string, uniqueId: string): Promise<PromptComment>;

  /**
   * Create a new comment on a prompt.
   * @returns The newly created PromptComment record.
   */
  create(promptUniqueId: string, data: CreatePromptCommentRequest): Promise<PromptComment>;

  /**
   * Update an existing prompt comment.
   * @returns The updated PromptComment record.
   */
  update(promptUniqueId: string, uniqueId: string, data: UpdatePromptCommentRequest): Promise<PromptComment>;

  /**
   * Delete a prompt comment.
   */
  delete(promptUniqueId: string, uniqueId: string): Promise<void>;

  /** Like a prompt comment. */
  like(promptUniqueId: string, uniqueId: string): Promise<void>;

  /** Remove a like from a prompt comment. */
  dislike(promptUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Reply to a prompt comment.
   * @returns The newly created reply PromptComment record.
   */
  reply(promptUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<PromptComment>;

  /** Follow a prompt comment to receive notifications. */
  follow(promptUniqueId: string, uniqueId: string): Promise<void>;

  /** Unfollow a prompt comment. */
  unfollow(promptUniqueId: string, uniqueId: string): Promise<void>;

  /** Save a prompt comment to bookmarks. */
  save(promptUniqueId: string, uniqueId: string): Promise<void>;

  /** Remove a prompt comment from bookmarks. */
  unsave(promptUniqueId: string, uniqueId: string): Promise<void>;
}

export function createPromptCommentsService(transport: Transport, _config: { appId: string }): PromptCommentsService {
  return {
    async list(promptUniqueId: string, params?: ListPromptCommentsParams): Promise<PageResult<PromptComment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/comments`, { params: queryParams });
      return decodePageResult(response, promptCommentMapper);
    },

    async get(promptUniqueId: string, uniqueId: string): Promise<PromptComment> {
      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/comments/${uniqueId}`);
      return decodeOne(response, promptCommentMapper);
    },

    async create(promptUniqueId: string, data: CreatePromptCommentRequest): Promise<PromptComment> {
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/comments`, {
        comment: {
          content: data.content,
          user_unique_id: data.userUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, promptCommentMapper);
    },

    async update(promptUniqueId: string, uniqueId: string, data: UpdatePromptCommentRequest): Promise<PromptComment> {
      const response = await transport.put<unknown>(`/prompts/${promptUniqueId}/comments/${uniqueId}`, {
        comment: {
          content: data.content,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, promptCommentMapper);
    },

    async delete(promptUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}`);
    },

    async like(promptUniqueId: string, uniqueId: string): Promise<void> {
      await transport.put(`/prompts/${promptUniqueId}/comments/${uniqueId}/like`, {});
    },

    async dislike(promptUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}/dislike`);
    },

    async reply(promptUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<PromptComment> {
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/comments/${uniqueId}/reply`, {
        comment: {
          content: data.content,
          user_unique_id: data.userUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, promptCommentMapper);
    },

    async follow(promptUniqueId: string, uniqueId: string): Promise<void> {
      await transport.put(`/prompts/${promptUniqueId}/comments/${uniqueId}/follow`, {});
    },

    async unfollow(promptUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}/unfollow`);
    },

    async save(promptUniqueId: string, uniqueId: string): Promise<void> {
      await transport.put(`/prompts/${promptUniqueId}/comments/${uniqueId}/save`, {});
    },

    async unsave(promptUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}/unsave`);
    },
  };
}
