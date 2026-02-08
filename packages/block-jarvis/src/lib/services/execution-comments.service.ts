import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ExecutionComment,
  CreateExecutionCommentRequest,
  UpdateExecutionCommentRequest,
  ListExecutionCommentsParams,
  ReplyToCommentRequest,
} from '../types/comment.js';
import { executionCommentMapper } from '../mappers/comment.mapper.js';

export interface ExecutionCommentsService {
  /**
   * List comments on an execution with optional filtering and sorting.
   * @returns Paginated list of ExecutionComment records with metadata.
   */
  list(promptUniqueId: string, executionUniqueId: string, params?: ListExecutionCommentsParams): Promise<PageResult<ExecutionComment>>;

  /**
   * Get a single execution comment by unique ID.
   * @returns The matching ExecutionComment record.
   */
  get(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<ExecutionComment>;

  /**
   * Create a new comment on an execution.
   * @returns The newly created ExecutionComment record.
   */
  create(promptUniqueId: string, executionUniqueId: string, data: CreateExecutionCommentRequest): Promise<ExecutionComment>;

  /**
   * Update an existing execution comment.
   * @returns The updated ExecutionComment record.
   */
  update(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: UpdateExecutionCommentRequest): Promise<ExecutionComment>;

  /**
   * Delete an execution comment.
   */
  delete(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;

  /** Like an execution comment. */
  like(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;

  /** Remove a like from an execution comment. */
  dislike(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Reply to an execution comment.
   * @returns The newly created reply ExecutionComment record.
   */
  reply(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<ExecutionComment>;

  /** Follow an execution comment to receive notifications. */
  follow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;

  /** Unfollow an execution comment. */
  unfollow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;

  /** Save an execution comment to bookmarks. */
  save(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;

  /** Remove an execution comment from bookmarks. */
  unsave(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;
}

export function createExecutionCommentsService(transport: Transport, _config: { appId: string }): ExecutionCommentsService {
  return {
    async list(promptUniqueId: string, executionUniqueId: string, params?: ListExecutionCommentsParams): Promise<PageResult<ExecutionComment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments`, { params: queryParams });
      return decodePageResult(response, executionCommentMapper);
    },

    async get(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<ExecutionComment> {
      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}`);
      return decodeOne(response, executionCommentMapper);
    },

    async create(promptUniqueId: string, executionUniqueId: string, data: CreateExecutionCommentRequest): Promise<ExecutionComment> {
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments`, {
        comment: {
          content: data.content,
          user_unique_id: data.userUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, executionCommentMapper);
    },

    async update(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: UpdateExecutionCommentRequest): Promise<ExecutionComment> {
      const response = await transport.put<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}`, {
        comment: {
          content: data.content,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, executionCommentMapper);
    },

    async delete(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}`);
    },

    async like(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      await transport.put(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/like`, {});
    },

    async dislike(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/dislike`);
    },

    async reply(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<ExecutionComment> {
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/reply`, {
        comment: {
          content: data.content,
          user_unique_id: data.userUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, executionCommentMapper);
    },

    async follow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      await transport.put(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/follow`, {});
    },

    async unfollow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/unfollow`);
    },

    async save(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      await transport.put(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/save`, {});
    },

    async unsave(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/unsave`);
    },
  };
}
