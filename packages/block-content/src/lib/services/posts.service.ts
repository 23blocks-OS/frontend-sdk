import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  ListPostsParams,
} from '../types/post';
import { postMapper } from '../mappers/post.mapper';

export interface PostsService {
  // Posts
  list(params?: ListPostsParams): Promise<PageResult<Post>>;
  get(uniqueId: string): Promise<Post>;
  create(data: CreatePostRequest): Promise<Post>;
  update(uniqueId: string, data: UpdatePostRequest): Promise<Post>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Post>;
  search(query: string, params?: ListPostsParams): Promise<PageResult<Post>>;
  listDeleted(params?: ListPostsParams): Promise<PageResult<Post>>;

  // Engagement
  like(uniqueId: string): Promise<Post>;
  dislike(uniqueId: string): Promise<Post>;
  save(uniqueId: string): Promise<Post>;
  follow(uniqueId: string): Promise<Post>;
}

export function createPostsService(transport: Transport, _config: { appId: string }): PostsService {
  return {
    async list(params?: ListPostsParams): Promise<PageResult<Post>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.categoryUniqueId) queryParams['category_unique_id'] = params.categoryUniqueId;
      if (params?.tagUniqueId) queryParams['tag_unique_id'] = params.tagUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.isPublic !== undefined) queryParams['is_public'] = String(params.isPublic);
      if (params?.withComments) queryParams['with'] = 'comments';
      if (params?.withCategories) queryParams['with'] = params.withComments ? 'comments,categories' : 'categories';
      if (params?.withTags) {
        queryParams['with'] = queryParams['with'] ? `${queryParams['with']},tags` : 'tags';
      }
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/posts', { params: queryParams });
      return decodePageResult(response, postMapper);
    },

    async get(uniqueId: string): Promise<Post> {
      const response = await transport.get<unknown>(`/posts/${uniqueId}`);
      return decodeOne(response, postMapper);
    },

    async create(data: CreatePostRequest): Promise<Post> {
      const response = await transport.post<unknown>('/posts', {
        data: {
          type: 'Post',
          attributes: {
            title: data.title,
            abstract: data.abstract,
            keywords: data.keywords,
            content: data.content,
            thumbnail_url: data.thumbnailUrl,
            image_url: data.imageUrl,
            media_url: data.mediaUrl,
            category_unique_ids: data.categoryUniqueIds,
            tag_unique_ids: data.tagUniqueIds,
            is_public: data.isPublic,
            publish_at: data.publishAt,
            publish_until: data.publishUntil,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, postMapper);
    },

    async update(uniqueId: string, data: UpdatePostRequest): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}`, {
        data: {
          type: 'Post',
          attributes: {
            title: data.title,
            abstract: data.abstract,
            keywords: data.keywords,
            content: data.content,
            thumbnail_url: data.thumbnailUrl,
            image_url: data.imageUrl,
            media_url: data.mediaUrl,
            category_unique_ids: data.categoryUniqueIds,
            tag_unique_ids: data.tagUniqueIds,
            is_public: data.isPublic,
            publish_at: data.publishAt,
            publish_until: data.publishUntil,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, postMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/posts/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}/recover`, {});
      return decodeOne(response, postMapper);
    },

    async search(query: string, params?: ListPostsParams): Promise<PageResult<Post>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/posts/search', { search: query }, { params: queryParams });
      return decodePageResult(response, postMapper);
    },

    async listDeleted(params?: ListPostsParams): Promise<PageResult<Post>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/posts/trash/show', { params: queryParams });
      return decodePageResult(response, postMapper);
    },

    // Engagement
    async like(uniqueId: string): Promise<Post> {
      const response = await transport.post<unknown>(`/posts/${uniqueId}/like`, {});
      return decodeOne(response, postMapper);
    },

    async dislike(uniqueId: string): Promise<Post> {
      const response = await transport.post<unknown>(`/posts/${uniqueId}/dislike`, {});
      return decodeOne(response, postMapper);
    },

    async save(uniqueId: string): Promise<Post> {
      const response = await transport.post<unknown>(`/posts/${uniqueId}/save`, {});
      return decodeOne(response, postMapper);
    },

    async follow(uniqueId: string): Promise<Post> {
      const response = await transport.post<unknown>(`/posts/${uniqueId}/follow`, {});
      return decodeOne(response, postMapper);
    },
  };
}
