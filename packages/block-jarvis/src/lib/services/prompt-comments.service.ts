import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PromptComment,
  CreatePromptCommentRequest,
  UpdatePromptCommentRequest,
  ListPromptCommentsParams,
  ReplyToCommentRequest,
} from '../types/comment';
import { promptCommentMapper } from '../mappers/comment.mapper';

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
