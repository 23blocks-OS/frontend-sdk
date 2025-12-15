import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ExecutionComment,
  CreateExecutionCommentRequest,
  UpdateExecutionCommentRequest,
  ListExecutionCommentsParams,
  ReplyToCommentRequest,
} from '../types/comment';
import { executionCommentMapper } from '../mappers/comment.mapper';

export interface ExecutionCommentsService {
  list(promptUniqueId: string, executionUniqueId: string, params?: ListExecutionCommentsParams): Promise<PageResult<ExecutionComment>>;
  get(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<ExecutionComment>;
  create(promptUniqueId: string, executionUniqueId: string, data: CreateExecutionCommentRequest): Promise<ExecutionComment>;
  update(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: UpdateExecutionCommentRequest): Promise<ExecutionComment>;
  delete(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;
  like(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;
  dislike(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;
  reply(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<ExecutionComment>;
  follow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;
  unfollow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;
  save(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void>;
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
