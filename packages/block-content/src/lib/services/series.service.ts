import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Series,
  CreateSeriesRequest,
  UpdateSeriesRequest,
  ListSeriesParams,
  QuerySeriesParams,
  ReorderPostsRequest,
} from '../types/series';
import type { Post } from '../types/post';
import { seriesMapper } from '../mappers/series.mapper';
import { postMapper } from '../mappers/post.mapper';

export interface SeriesService {
  // CRUD Operations
  list(params?: ListSeriesParams): Promise<PageResult<Series>>;
  query(params: QuerySeriesParams): Promise<PageResult<Series>>;
  get(uniqueId: string): Promise<Series>;
  create(data: CreateSeriesRequest): Promise<Series>;
  update(uniqueId: string, data: UpdateSeriesRequest): Promise<Series>;
  delete(uniqueId: string): Promise<void>;

  // Social Actions
  like(uniqueId: string): Promise<Series>;
  dislike(uniqueId: string): Promise<Series>;
  follow(uniqueId: string): Promise<Series>;
  unfollow(uniqueId: string): Promise<void>;
  save(uniqueId: string): Promise<Series>;
  unsave(uniqueId: string): Promise<void>;

  // Post Management
  getPosts(uniqueId: string): Promise<Post[]>;
  addPost(seriesUniqueId: string, postUniqueId: string, sequence?: number): Promise<void>;
  removePost(seriesUniqueId: string, postUniqueId: string): Promise<void>;
  reorderPosts(uniqueId: string, data: ReorderPostsRequest): Promise<Series>;
}

export function createSeriesService(transport: Transport, _config: { appId: string }): SeriesService {
  return {
    // CRUD Operations
    async list(params?: ListSeriesParams): Promise<PageResult<Series>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/series', { params: queryParams });
      return decodePageResult(response, seriesMapper);
    },

    async query(params: QuerySeriesParams): Promise<PageResult<Series>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.visibility) queryParams['visibility'] = params.visibility;
      if (params?.completionStatus) queryParams['completion_status'] = params.completionStatus;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;

      const response = await transport.post<unknown>('/series/query', queryParams);
      return decodePageResult(response, seriesMapper);
    },

    async get(uniqueId: string): Promise<Series> {
      const response = await transport.get<unknown>(`/series/${uniqueId}`);
      return decodeOne(response, seriesMapper);
    },

    async create(data: CreateSeriesRequest): Promise<Series> {
      const response = await transport.post<unknown>('/series', {
        series: {
          title: data.title,
          description: data.description,
          slug: data.slug,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          visibility: data.visibility,
          completion_status: data.completionStatus,
          payload: data.payload,
        },
      });
      return decodeOne(response, seriesMapper);
    },

    async update(uniqueId: string, data: UpdateSeriesRequest): Promise<Series> {
      const response = await transport.put<unknown>(`/series/${uniqueId}`, {
        series: {
          title: data.title,
          description: data.description,
          slug: data.slug,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          visibility: data.visibility,
          completion_status: data.completionStatus,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, seriesMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/series/${uniqueId}`);
    },

    // Social Actions
    async like(uniqueId: string): Promise<Series> {
      const response = await transport.put<unknown>(`/series/${uniqueId}/like`, {});
      return decodeOne(response, seriesMapper);
    },

    async dislike(uniqueId: string): Promise<Series> {
      const response = await transport.put<unknown>(`/series/${uniqueId}/dislike`, {});
      return decodeOne(response, seriesMapper);
    },

    async follow(uniqueId: string): Promise<Series> {
      const response = await transport.put<unknown>(`/series/${uniqueId}/follow`, {});
      return decodeOne(response, seriesMapper);
    },

    async unfollow(uniqueId: string): Promise<void> {
      await transport.delete(`/series/${uniqueId}/unfollow`);
    },

    async save(uniqueId: string): Promise<Series> {
      const response = await transport.put<unknown>(`/series/${uniqueId}/save`, {});
      return decodeOne(response, seriesMapper);
    },

    async unsave(uniqueId: string): Promise<void> {
      await transport.delete(`/series/${uniqueId}/unsave`);
    },

    // Post Management
    async getPosts(uniqueId: string): Promise<Post[]> {
      const response = await transport.get<unknown>(`/series/${uniqueId}/posts`);
      return decodeMany(response, postMapper);
    },

    async addPost(seriesUniqueId: string, postUniqueId: string, sequence?: number): Promise<void> {
      const queryParams: Record<string, string> = {};
      if (sequence !== undefined) queryParams['sequence'] = String(sequence);

      await transport.post(`/series/${seriesUniqueId}/posts/${postUniqueId}`, {}, { params: queryParams });
    },

    async removePost(seriesUniqueId: string, postUniqueId: string): Promise<void> {
      await transport.delete(`/series/${seriesUniqueId}/posts/${postUniqueId}`);
    },

    async reorderPosts(uniqueId: string, data: ReorderPostsRequest): Promise<Series> {
      const response = await transport.put<unknown>(`/series/${uniqueId}/reorder`, {
        posts: data.posts.map(p => ({
          post_unique_id: p.postUniqueId,
          sequence: p.sequence,
        })),
      });
      return decodeOne(response, seriesMapper);
    },
  };
}
