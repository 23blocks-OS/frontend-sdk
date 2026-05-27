import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PromptComment,
  CreatePromptCommentRequest,
  UpdatePromptCommentRequest,
  ListPromptCommentsParams,
  ReplyToCommentRequest,
} from '../types/comment.js';
import { promptCommentMapper } from '../mappers/comment.mapper.js';

function buildCommentBody(data: CreatePromptCommentRequest): Record<string, unknown> {
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

export interface PromptCommentsService {
  list(promptUniqueId: string, params?: ListPromptCommentsParams): Promise<PageResult<PromptComment>>;
  get(promptUniqueId: string, uniqueId: string): Promise<PromptComment>;
  create(promptUniqueId: string, data: CreatePromptCommentRequest): Promise<PromptComment>;
  update(promptUniqueId: string, uniqueId: string, data: UpdatePromptCommentRequest): Promise<PromptComment>;
  delete(promptUniqueId: string, uniqueId: string): Promise<void>;
  like(promptUniqueId: string, uniqueId: string): Promise<void>;
  dislike(promptUniqueId: string, uniqueId: string): Promise<void>;
  reply(promptUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<PromptComment>;
  follow(promptUniqueId: string, uniqueId: string): Promise<void>;
  unfollow(promptUniqueId: string, uniqueId: string): Promise<void>;
  save(promptUniqueId: string, uniqueId: string): Promise<void>;
  unsave(promptUniqueId: string, uniqueId: string): Promise<void>;
}

export function createPromptCommentsService(transport: Transport, _config: { apiKey: string }): PromptCommentsService {
  return {
    async list(promptUniqueId: string, params?: ListPromptCommentsParams): Promise<PageResult<PromptComment>> {
      assertUuid(promptUniqueId, 'promptUniqueId');
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
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/comments/${uniqueId}`);
      return decodeOne(response, promptCommentMapper);
    },

    async create(promptUniqueId: string, data: CreatePromptCommentRequest): Promise<PromptComment> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/comments`, {
        comment: buildCommentBody(data),
      });
      return decodeOne(response, promptCommentMapper);
    },

    async update(promptUniqueId: string, uniqueId: string, data: UpdatePromptCommentRequest): Promise<PromptComment> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/prompts/${promptUniqueId}/comments/${uniqueId}`, {
        comment: buildCommentBody(data),
      });
      return decodeOne(response, promptCommentMapper);
    },

    async delete(promptUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}`);
    },

    async like(promptUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.put(`/prompts/${promptUniqueId}/comments/${uniqueId}/like`, {});
    },

    async dislike(promptUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}/dislike`);
    },

    async reply(promptUniqueId: string, uniqueId: string, data: ReplyToCommentRequest): Promise<PromptComment> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/comments/${uniqueId}/reply`, {
        comment: buildCommentBody(data),
      });
      return decodeOne(response, promptCommentMapper);
    },

    async follow(promptUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.put(`/prompts/${promptUniqueId}/comments/${uniqueId}/follow`, {});
    },

    async unfollow(promptUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}/unfollow`);
    },

    async save(promptUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.put(`/prompts/${promptUniqueId}/comments/${uniqueId}/save`, {});
    },

    async unsave(promptUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/comments/${uniqueId}/unsave`);
    },
  };
}
