import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
  createPostsService,
  createPostVersionsService,
  createPostTemplatesService,
  createCommentsService,
  createCategoriesService,
  createTagsService,
  createContentUsersService,
  createModerationService,
  createActivityService,
  createSeriesService,
  type PostsService,
  type PostVersionsService,
  type PostTemplatesService,
  type CommentsService,
  type CategoriesService,
  type TagsService,
  type ContentUsersService,
  type ModerationService,
  type ActivityService,
  type SeriesService,
} from './services/index.js';

/**
 * Configuration for the Content block.
 */
export interface ContentBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Content management block interface.
 */
export interface ContentBlock {
  /** Post CRUD operations */
  posts: PostsService;
  /** Post version history management */
  postVersions: PostVersionsService;
  /** Post template management */
  postTemplates: PostTemplatesService;
  /** Comment management */
  comments: CommentsService;
  /** Content category management */
  categories: CategoriesService;
  /** Content tag management */
  tags: TagsService;
  /** Content user management */
  users: ContentUsersService;
  /** Content moderation operations */
  moderation: ModerationService;
  /** Activity feed management */
  activity: ActivityService;
  /** Content series management */
  series: SeriesService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Content block.
 *
 * @example
 * ```typescript
 * const block = createContentBlock(transport, { appId: 'xxx' });
 * const posts = await block.posts.list({ page: 1 });
 * ```
 */
export function createContentBlock(
  transport: Transport,
  config: ContentBlockConfig
): ContentBlock {
  return {
    posts: createPostsService(transport, config),
    postVersions: createPostVersionsService(transport, config),
    postTemplates: createPostTemplatesService(transport, config),
    comments: createCommentsService(transport, config),
    categories: createCategoriesService(transport, config),
    tags: createTagsService(transport, config),
    users: createContentUsersService(transport, config),
    moderation: createModerationService(transport, config),
    activity: createActivityService(transport, config),
    series: createSeriesService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
  };
}

export const contentBlockMetadata: BlockMetadata = {
  name: 'content',
  version: '0.1.0',
  description: 'Content management for posts, comments, categories, tags, and users',
  resourceTypes: [
    'Post',
    'PostVersion',
    'PostTemplate',
    'Comment',
    'Category',
    'Tag',
    'ContentUser',
    'Following',
    'ContentFlag',
    'Activity',
    'Series',
  ],
};
