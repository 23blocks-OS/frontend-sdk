import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Series,
  CreateSeriesRequest,
  UpdateSeriesRequest,
  ListSeriesParams,
  QuerySeriesParams,
  ReorderPostsRequest,
} from '../types/series.js';
import type { Post } from '../types/post.js';
import { seriesMapper } from '../mappers/series.mapper.js';
import { postMapper } from '../mappers/post.mapper.js';

export interface SeriesService {
  // CRUD Operations

  /**
   * List all series
   * @param params - Optional pagination parameters
   * @returns Paginated list of Series records with pagination metadata
   */
  list(params?: ListSeriesParams): Promise<PageResult<Series>>;

  /**
   * Query series using advanced filters via POST
   * @param params - Required filtering and pagination parameters
   * @returns Paginated list of Series records with pagination metadata
   */
  query(params: QuerySeriesParams): Promise<PageResult<Series>>;

  /**
   * Get a series by unique ID
   * @param uniqueId - Unique ID of the series to retrieve
   * @returns The matching Series record
   */
  get(uniqueId: string): Promise<Series>;

  /**
   * Create a new series
   * @param data - Series creation payload
   * @returns The newly created Series record
   */
  create(data: CreateSeriesRequest): Promise<Series>;

  /**
   * Update a series
   * @param uniqueId - Unique ID of the series to update
   * @param data - Fields to update on the series
   * @returns The updated Series record
   */
  update(uniqueId: string, data: UpdateSeriesRequest): Promise<Series>;

  /**
   * Delete a series
   * @param uniqueId - Unique ID of the series to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;

  // Social Actions

  /**
   * Like a series
   * @param uniqueId - Unique ID of the series to like
   * @returns The updated Series record with engagement state
   */
  like(uniqueId: string): Promise<Series>;

  /**
   * Remove a like from a series
   * @param uniqueId - Unique ID of the series to dislike
   * @returns The updated Series record with engagement state
   */
  dislike(uniqueId: string): Promise<Series>;

  /**
   * Follow a series to receive notifications on updates
   * @param uniqueId - Unique ID of the series to follow
   * @returns The updated Series record with engagement state
   */
  follow(uniqueId: string): Promise<Series>;

  /**
   * Unfollow a series to stop receiving notifications
   * @param uniqueId - Unique ID of the series to unfollow
   * @returns void on successful unfollow
   */
  unfollow(uniqueId: string): Promise<void>;

  /**
   * Save a series to the user's saved items
   * @param uniqueId - Unique ID of the series to save
   * @returns The updated Series record with engagement state
   */
  save(uniqueId: string): Promise<Series>;

  /**
   * Remove a series from the user's saved items
   * @param uniqueId - Unique ID of the series to unsave
   * @returns void on successful unsave
   */
  unsave(uniqueId: string): Promise<void>;

  // Post Management

  /**
   * Get all posts belonging to a series
   * @param uniqueId - Unique ID of the series
   * @returns Array of Post records in the series
   */
  getPosts(uniqueId: string): Promise<Post[]>;

  /**
   * Add a post to a series
   * @param seriesUniqueId - Unique ID of the series
   * @param postUniqueId - Unique ID of the post to add
   * @param sequence - Optional position in the series ordering
   * @returns void on successful addition
   */
  addPost(seriesUniqueId: string, postUniqueId: string, sequence?: number): Promise<void>;

  /**
   * Remove a post from a series
   * @param seriesUniqueId - Unique ID of the series
   * @param postUniqueId - Unique ID of the post to remove
   * @returns void on successful removal
   */
  removePost(seriesUniqueId: string, postUniqueId: string): Promise<void>;

  /**
   * Reorder posts within a series
   * @param uniqueId - Unique ID of the series
   * @param data - Array of post-sequence pairs defining the new order
   * @returns The updated Series record
   */
  reorderPosts(uniqueId: string, data: ReorderPostsRequest): Promise<Series>;
}

export function createSeriesService(transport: Transport, _config: { apiKey: string }): SeriesService {
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
