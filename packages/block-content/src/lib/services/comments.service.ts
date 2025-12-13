import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  ListCommentsParams,
} from '../types/comment';
import { commentMapper } from '../mappers/comment.mapper';

export interface CommentsService {
  list(params?: ListCommentsParams): Promise<PageResult<Comment>>;
  get(uniqueId: string): Promise<Comment>;
  create(data: CreateCommentRequest): Promise<Comment>;
  update(uniqueId: string, data: UpdateCommentRequest): Promise<Comment>;
  delete(uniqueId: string): Promise<void>;

  // Engagement
  like(uniqueId: string): Promise<Comment>;
  dislike(uniqueId: string): Promise<Comment>;
}

export function createCommentsService(transport: Transport, _config: { appId: string }): CommentsService {
  return {
    async list(params?: ListCommentsParams): Promise<PageResult<Comment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.postUniqueId) queryParams['post_unique_id'] = params.postUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.parentId) queryParams['parent_id'] = params.parentId;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>('/comments', { params: queryParams });
      return decodePageResult(response, commentMapper);
    },

    async get(uniqueId: string): Promise<Comment> {
      const response = await transport.get<unknown>(`/comments/${uniqueId}`);
      return decodeOne(response, commentMapper);
    },

    async create(data: CreateCommentRequest): Promise<Comment> {
      const response = await transport.post<unknown>('/comments', {
        data: {
          type: 'Comment',
          attributes: {
            post_unique_id: data.postUniqueId,
            content: data.content,
            thumbnail_url: data.thumbnailUrl,
            image_url: data.imageUrl,
            content_url: data.contentUrl,
            media_url: data.mediaUrl,
            parent_id: data.parentId,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, commentMapper);
    },

    async update(uniqueId: string, data: UpdateCommentRequest): Promise<Comment> {
      const response = await transport.put<unknown>(`/comments/${uniqueId}`, {
        data: {
          type: 'Comment',
          attributes: {
            content: data.content,
            thumbnail_url: data.thumbnailUrl,
            image_url: data.imageUrl,
            content_url: data.contentUrl,
            media_url: data.mediaUrl,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, commentMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/comments/${uniqueId}`);
    },

    // Engagement
    async like(uniqueId: string): Promise<Comment> {
      const response = await transport.post<unknown>(`/comments/${uniqueId}/like`, {});
      return decodeOne(response, commentMapper);
    },

    async dislike(uniqueId: string): Promise<Comment> {
      const response = await transport.post<unknown>(`/comments/${uniqueId}/dislike`, {});
      return decodeOne(response, commentMapper);
    },
  };
}
