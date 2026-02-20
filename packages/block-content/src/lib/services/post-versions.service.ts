import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, type JsonApiResource } from '@23blocks/jsonapi-codec';
import type { PostVersion, ListPostVersionsParams } from '../types/post-version.js';
import { postVersionMapper } from '../mappers/post-version.mapper.js';

export interface PostVersionsService {
  /**
   * List all versions of a post
   * @param postUniqueId - Unique ID of the post to list versions for
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of PostVersion records with pagination metadata
   * @note Versions are extracted from the post's included relationships rather than a dedicated endpoint
   */
  list(postUniqueId: string, params?: ListPostVersionsParams): Promise<PageResult<PostVersion>>;

  /**
   * Get a specific version of a post
   * @param postUniqueId - Unique ID of the parent post
   * @param versionUniqueId - Unique ID of the version to retrieve
   * @returns The matching PostVersion record
   * @note Fetches the post with included versions and filters to the requested version; throws if not found
   */
  get(postUniqueId: string, versionUniqueId: string): Promise<PostVersion>;

  /**
   * Publish a specific version (makes it the current live version)
   * @param postUniqueId - Unique ID of the parent post
   * @param versionUniqueId - Unique ID of the version to publish
   * @returns The published PostVersion record
   */
  publish(postUniqueId: string, versionUniqueId: string): Promise<PostVersion>;
}

export function createPostVersionsService(transport: Transport, _config: { appId: string }): PostVersionsService {
  return {
    async list(postUniqueId: string, params?: ListPostVersionsParams): Promise<PageResult<PostVersion>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;

      // Note: The API may not have a dedicated versions list endpoint
      // This uses the post_versions relationship from the post
      const response = await transport.get<unknown>(`/posts/${postUniqueId}`, {
        params: { ...queryParams, include: 'post_versions' }
      });

      // Extract versions from included relationships
      const data = response as { data?: { relationships?: { post_versions?: { data?: unknown[] } } }, included?: unknown[] };
      if (data.included) {
        const versions = data.included.filter((item: unknown) => {
          const typed = item as { type?: string };
          return typed.type === 'PostVersion' || typed.type === 'post_version';
        });
        return {
          data: versions.map((v) => postVersionMapper.map(v as any, new Map())),
          meta: { totalCount: versions.length, currentPage: 1, perPage: versions.length, totalPages: 1 },
        };
      }

      return { data: [], meta: { totalCount: 0, currentPage: 1, perPage: 10, totalPages: 0 } };
    },

    async get(postUniqueId: string, versionUniqueId: string): Promise<PostVersion> {
      // Get post with versions included and find the specific one
      const response = await transport.get<unknown>(`/posts/${postUniqueId}`, {
        params: { include: 'post_versions' }
      });

      const data = response as { included?: Array<{ id: string; type?: string; attributes: Record<string, unknown> }> };
      if (data.included) {
        const version = data.included.find((item) =>
          (item.type === 'PostVersion' || item.type === 'post_version') &&
          (item.attributes['unique_id'] === versionUniqueId || item.id === versionUniqueId)
        );
        if (version) {
          return postVersionMapper.map(version as JsonApiResource, new Map());
        }
      }

      throw new Error(`Version ${versionUniqueId} not found for post ${postUniqueId}`);
    },

    async publish(postUniqueId: string, versionUniqueId: string): Promise<PostVersion> {
      const response = await transport.post<unknown>(`/posts/${postUniqueId}/versions/${versionUniqueId}/publish`, {});
      return decodeOne(response, postVersionMapper);
    },
  };
}
