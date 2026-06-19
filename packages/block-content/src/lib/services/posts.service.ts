import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  ListPostsParams,
} from '../types/post.js';
import type { PostValidationResult } from '../types/post-template.js';
import { postMapper } from '../mappers/post.mapper.js';
import { parseValidationResult } from '../mappers/post-template.mapper.js';

export interface PostsService {
  // Posts

  /**
   * List all posts
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of Post records with pagination metadata
   */
  list(params?: ListPostsParams): Promise<PageResult<Post>>;

  /**
   * Query posts using advanced filters via POST
   * @param params - Required filtering and pagination parameters
   * @returns Paginated list of Post records with pagination metadata
   * @note Uses POST for complex query payloads unlike the GET-based list method
   */
  query(params: ListPostsParams): Promise<PageResult<Post>>;

  /**
   * Get a post by unique ID
   * @param uniqueId - Unique ID of the post to retrieve
   * @returns The matching Post record
   */
  get(uniqueId: string): Promise<Post>;

  /**
   * Create a new post
   * @param data - Post creation payload
   * @returns The newly created Post record
   */
  create(data: CreatePostRequest): Promise<Post>;

  /**
   * Update a post (partial update)
   * @param uniqueId - Unique ID of the post to update
   * @param data - Fields to update on the post
   * @returns The updated Post record
   */
  update(uniqueId: string, data: UpdatePostRequest): Promise<Post>;

  /**
   * Replace a post (full replacement)
   * @param uniqueId - Unique ID of the post to replace
   * @param data - Complete post data to replace the existing record
   * @returns The replaced Post record
   * @note Unlike update, this replaces the entire post content rather than merging fields
   */
  replace(uniqueId: string, data: UpdatePostRequest): Promise<Post>;

  /**
   * Delete a post (soft delete)
   * @param uniqueId - Unique ID of the post to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted post
   * @param uniqueId - Unique ID of the deleted post to recover
   * @returns The recovered Post record
   */
  recover(uniqueId: string): Promise<Post>;

  /**
   * Search posts by query string
   * @param query - Search query text
   * @param params - Optional pagination parameters
   * @returns Paginated list of matching Post records with pagination metadata
   */
  search(query: string, params?: ListPostsParams): Promise<PageResult<Post>>;

  /**
   * List soft-deleted posts
   * @param params - Optional pagination parameters
   * @returns Paginated list of deleted Post records with pagination metadata
   */
  listDeleted(params?: ListPostsParams): Promise<PageResult<Post>>;

  // Ownership

  /**
   * Transfer ownership of a post to another user
   * @param uniqueId - Unique ID of the post to transfer
   * @param newOwnerUniqueId - Unique ID of the new owner
   * @returns The updated Post record with new ownership
   */
  changeOwner(uniqueId: string, newOwnerUniqueId: string): Promise<Post>;

  // Versioning

  /**
   * Publish a specific version of a post
   * @param uniqueId - Unique ID of the post
   * @param versionUniqueId - Unique ID of the version to publish
   * @returns The updated Post record reflecting the published version
   */
  publishVersion(uniqueId: string, versionUniqueId: string): Promise<Post>;

  // Engagement

  /**
   * Like a post
   * @param uniqueId - Unique ID of the post to like
   * @returns The updated Post record with engagement state
   */
  like(uniqueId: string): Promise<Post>;

  /**
   * Remove a like from a post
   * @param uniqueId - Unique ID of the post to dislike
   * @returns The updated Post record with engagement state
   */
  dislike(uniqueId: string): Promise<Post>;

  /**
   * Save a post to the user's saved items
   * @param uniqueId - Unique ID of the post to save
   * @returns The updated Post record with engagement state
   */
  save(uniqueId: string): Promise<Post>;

  /**
   * Remove a post from the user's saved items
   * @param uniqueId - Unique ID of the post to unsave
   * @returns The updated Post record with engagement state
   */
  unsave(uniqueId: string): Promise<Post>;

  /**
   * Follow a post to receive notifications on updates
   * @param uniqueId - Unique ID of the post to follow
   * @returns The updated Post record with engagement state
   */
  follow(uniqueId: string): Promise<Post>;

  /**
   * Unfollow a post to stop receiving notifications
   * @param uniqueId - Unique ID of the post to unfollow
   * @returns The updated Post record with engagement state
   */
  unfollow(uniqueId: string): Promise<Post>;

  // Validation

  /**
   * Validate a post against a post template
   * @param uniqueId - Unique ID of the post to validate
   * @param templateUniqueId - Unique ID of the template to validate against
   * @returns PostValidationResult indicating whether the post conforms to the template
   */
  validate(uniqueId: string, templateUniqueId: string): Promise<PostValidationResult>;
}

export function createPostsService(transport: Transport, _config: { apiKey: string }): PostsService {
  const buildQueryParams = (params?: ListPostsParams): Record<string, string> => {
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
    return queryParams;
  };

  return {
    async list(params?: ListPostsParams): Promise<PageResult<Post>> {
      const response = await transport.get<unknown>('/posts', { params: buildQueryParams(params) });
      return decodePageResult(response, postMapper);
    },

    async query(params: ListPostsParams): Promise<PageResult<Post>> {
      const response = await transport.post<unknown>('/posts/query', buildQueryParams(params));
      return decodePageResult(response, postMapper);
    },

    async get(uniqueId: string): Promise<Post> {
      const response = await transport.get<unknown>(`/posts/${uniqueId}`);
      return decodeOne(response, postMapper);
    },

    async create(data: CreatePostRequest): Promise<Post> {
      const response = await transport.post<unknown>('/posts', {
        post: {
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
          series_unique_id: data.seriesUniqueId,
          series_sequence: data.seriesSequence,
        },
      });
      return decodeOne(response, postMapper);
    },

    async update(uniqueId: string, data: UpdatePostRequest): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}`, {
        post: {
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
          series_unique_id: data.seriesUniqueId,
          series_sequence: data.seriesSequence,
        },
      });
      return decodeOne(response, postMapper);
    },

    async replace(uniqueId: string, data: UpdatePostRequest): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}/replace`, {
        post: {
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
          series_unique_id: data.seriesUniqueId,
          series_sequence: data.seriesSequence,
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
      // Content API doesn't expose POST /posts/search — that route 404s.
      // Simple text search uses the index endpoint with a ?search= query
      // string. Confirmed by api-content in msg_1781891314_6dbaa860.
      // (For structured JSONB filtering, see the separate POST /posts/query
      // endpoint — not yet exposed by this service.)
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/posts', { params: queryParams });
      return decodePageResult(response, postMapper);
    },

    async listDeleted(params?: ListPostsParams): Promise<PageResult<Post>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/posts/trash/show', { params: queryParams });
      return decodePageResult(response, postMapper);
    },

    // Ownership
    async changeOwner(uniqueId: string, newOwnerUniqueId: string): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}/own`, {
        post: { new_owner_unique_id: newOwnerUniqueId },
      });
      return decodeOne(response, postMapper);
    },

    // Versioning
    async publishVersion(uniqueId: string, versionUniqueId: string): Promise<Post> {
      const response = await transport.post<unknown>(`/posts/${uniqueId}/versions/${versionUniqueId}/publish`, {});
      return decodeOne(response, postMapper);
    },

    // Engagement
    async like(uniqueId: string): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}/like`, {});
      return decodeOne(response, postMapper);
    },

    async dislike(uniqueId: string): Promise<Post> {
      const response = await transport.delete<unknown>(`/posts/${uniqueId}/dislike`);
      return decodeOne(response, postMapper);
    },

    async save(uniqueId: string): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}/save`, {});
      return decodeOne(response, postMapper);
    },

    async unsave(uniqueId: string): Promise<Post> {
      const response = await transport.delete<unknown>(`/posts/${uniqueId}/unsave`);
      return decodeOne(response, postMapper);
    },

    async follow(uniqueId: string): Promise<Post> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}/follow`, {});
      return decodeOne(response, postMapper);
    },

    async unfollow(uniqueId: string): Promise<Post> {
      const response = await transport.delete<unknown>(`/posts/${uniqueId}/unfollow`);
      return decodeOne(response, postMapper);
    },

    // Validation
    async validate(uniqueId: string, templateUniqueId: string): Promise<PostValidationResult> {
      const response = await transport.put<unknown>(`/posts/${uniqueId}/validate`, {}, {
        params: { template_unique_id: templateUniqueId },
      });
      return parseValidationResult(response);
    },
  };
}
