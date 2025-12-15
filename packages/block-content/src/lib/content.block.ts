import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createPostsService,
  createCommentsService,
  createCategoriesService,
  createTagsService,
  createContentUsersService,
  type PostsService,
  type CommentsService,
  type CategoriesService,
  type TagsService,
  type ContentUsersService,
} from './services';

export interface ContentBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface ContentBlock {
  posts: PostsService;
  comments: CommentsService;
  categories: CategoriesService;
  tags: TagsService;
  users: ContentUsersService;
}

export function createContentBlock(
  transport: Transport,
  config: ContentBlockConfig
): ContentBlock {
  return {
    posts: createPostsService(transport, config),
    comments: createCommentsService(transport, config),
    categories: createCategoriesService(transport, config),
    tags: createTagsService(transport, config),
    users: createContentUsersService(transport, config),
  };
}

export const contentBlockMetadata: BlockMetadata = {
  name: 'content',
  version: '0.1.0',
  description: 'Content management for posts, comments, categories, tags, and users',
  resourceTypes: [
    'Post',
    'Comment',
    'Category',
    'Tag',
    'ContentUser',
  ],
};
