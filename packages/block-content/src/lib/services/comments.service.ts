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

  // Reply to a comment (creates a nested comment)
  reply(parentCommentUniqueId: string, data: Omit<CreateCommentRequest, 'parentId'>): Promise<Comment>;

  // Engagement
  like(uniqueId: string): Promise<Comment>;
  dislike(uniqueId: string): Promise<Comment>;
  save(uniqueId: string): Promise<Comment>;
  unsave(uniqueId: string): Promise<Comment>;
  follow(uniqueId: string): Promise<Comment>;
  unfollow(uniqueId: string): Promise<Comment>;
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
        comment: {
          post_unique_id: data.postUniqueId,
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

    async update(uniqueId: string, data: UpdateCommentRequest): Promise<Comment> {
      const response = await transport.put<unknown>(`/comments/${uniqueId}`, {
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

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/comments/${uniqueId}`);
    },

    async reply(parentCommentUniqueId: string, data: Omit<CreateCommentRequest, 'parentId'>): Promise<Comment> {
      const response = await transport.post<unknown>('/comments', {
        comment: {
          post_unique_id: data.postUniqueId,
          content: data.content,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          parent_id: parentCommentUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, commentMapper);
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

    async save(uniqueId: string): Promise<Comment> {
      const response = await transport.put<unknown>(`/comments/${uniqueId}/save`, {});
      return decodeOne(response, commentMapper);
    },

    async unsave(uniqueId: string): Promise<Comment> {
      const response = await transport.delete<unknown>(`/comments/${uniqueId}/unsave`);
      return decodeOne(response, commentMapper);
    },

    async follow(uniqueId: string): Promise<Comment> {
      const response = await transport.put<unknown>(`/comments/${uniqueId}/follow`, {});
      return decodeOne(response, commentMapper);
    },

    async unfollow(uniqueId: string): Promise<Comment> {
      const response = await transport.delete<unknown>(`/comments/${uniqueId}/unfollow`);
      return decodeOne(response, commentMapper);
    },
  };
}
