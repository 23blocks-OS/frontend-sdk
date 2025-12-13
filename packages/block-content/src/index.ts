// Block factory and metadata
export { createContentBlock, contentBlockMetadata } from './lib/content.block';
export type { ContentBlock, ContentBlockConfig } from './lib/content.block';

// Types
export type {
  // Post types
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  ListPostsParams,
  // Comment types
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  ListCommentsParams,
  // Category types
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ListCategoriesParams,
  // Tag types
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  ListTagsParams,
} from './lib/types';

// Services
export type {
  PostsService,
  CommentsService,
  CategoriesService,
  TagsService,
} from './lib/services';

export {
  createPostsService,
  createCommentsService,
  createCategoriesService,
  createTagsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  postMapper,
  commentMapper,
  categoryMapper,
  tagMapper,
} from './lib/mappers';
