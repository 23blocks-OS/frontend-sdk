import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ExecutionComment,
  CreateExecutionCommentRequest,
  UpdateExecutionCommentRequest,
  ListExecutionCommentsParams,
  ReplyToCommentRequest,
} from '../types/comment.js';
import { executionCommentMapper } from '../mappers/comment.mapper.js';

function buildCommentBody(data: CreateExecutionCommentRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.content) body['content'] = data.content;
  if (data.thumbnailUrl) body['thumbnail_url'] = data.thumbnailUrl;
  if (data.imageUrl) body['image_url'] = data.imageUrl;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.mediaUrl) body['media_url'] = data.mediaUrl;
  if (data.userUniqueId) body['user_unique_id'] = data.userUniqueId;
  if (data.userName) body['user_name'] = data.userName;
  if (data.userAlias) body['user_alias'] = data.userAlias;
  if (data.userAvatarUrl) body['user_avatar_url'] = data.userAvatarUrl;
  if (data.status) body['status'] = data.status;
  if (data.aiGenerated !== undefined) body['ai_generated'] = data.aiGenerated;
  if (data.aiModel) body['ai_model'] = data.aiModel;
  return body;
}

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

export function createExecutionCommentsService(transport: Transport, _config: { apiKey: string }): ExecutionCommentsService {
  return {
    async list(promptUniqueId: string, executionUniqueId: string, params?: ListExecutionCommentsParams): Promise<PageResult<ExecutionComment>> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
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
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}`);
      return decodeOne(response, executionCommentMapper);
    },

    async create(promptUniqueId: string, executionUniqueId: string, data: CreateExecutionCommentRequest): Promise<ExecutionComment> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments`, {
        comment: buildCommentBody(data),
      });
      return decodeOne(response, executionCommentMapper);
    },

    async update(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: UpdateExecutionCommentRequest): Promise<ExecutionComment> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}`, {
        comment: buildCommentBody(data),
      });
      return decodeOne(response, executionCommentMapper);
    },

    async delete(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}`);
    },

    async like(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.put(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/like`, {});
    },

    async dislike(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/dislike`);
    },

    async reply(promptUniqueId: string, executionUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<ExecutionComment> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/reply`, {
        comment: buildCommentBody(data),
      });
      return decodeOne(response, executionCommentMapper);
    },

    async follow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.put(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/follow`, {});
    },

    async unfollow(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/unfollow`);
    },

    async save(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.put(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/save`, {});
    },

    async unsave(promptUniqueId: string, executionUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(executionUniqueId, 'executionUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/executions/${executionUniqueId}/comments/${uniqueId}/unsave`);
    },
  };
}
