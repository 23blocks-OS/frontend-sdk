import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createPostsService,
  createPostVersionsService,
  createCommentsService,
  createCategoriesService,
  createTagsService,
  createContentUsersService,
  createModerationService,
  createActivityService,
  type PostsService,
  type PostVersionsService,
  type CommentsService,
  type CategoriesService,
  type TagsService,
  type ContentUsersService,
  type ModerationService,
  type ActivityService,
} from './services';

export interface ContentBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface ContentBlock {
  posts: PostsService;
  postVersions: PostVersionsService;
  comments: CommentsService;
  categories: CategoriesService;
  tags: TagsService;
  users: ContentUsersService;
  moderation: ModerationService;
  activity: ActivityService;
}

export function createContentBlock(
  transport: Transport,
  config: ContentBlockConfig
): ContentBlock {
  return {
    posts: createPostsService(transport, config),
    postVersions: createPostVersionsService(transport, config),
    comments: createCommentsService(transport, config),
    categories: createCategoriesService(transport, config),
    tags: createTagsService(transport, config),
    users: createContentUsersService(transport, config),
    moderation: createModerationService(transport, config),
    activity: createActivityService(transport, config),
  };
}

export const contentBlockMetadata: BlockMetadata = {
  name: 'content',
  version: '0.1.0',
  description: 'Content management for posts, comments, categories, tags, and users',
  resourceTypes: [
    'Post',
    'PostVersion',
    'Comment',
    'Category',
    'Tag',
    'ContentUser',
    'Following',
    'ContentFlag',
    'Activity',
  ],
};
