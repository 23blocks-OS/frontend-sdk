# @23blocks/block-content

Content block for the 23blocks SDK - blog posts, comments, categories, and tags.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-content.svg)](https://www.npmjs.com/package/@23blocks/block-content)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-content @23blocks/transport-http
```

## Overview

This package provides content management functionality including:

- **Posts** - Blog posts and articles
- **Comments** - User comments on posts
- **Categories** - Content categorization
- **Tags** - Content tagging

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createContentBlock } from '@23blocks/block-content';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const content = createContentBlock(transport, {
  apiKey: 'your-api-key',
});

// List published posts
const { data: posts } = await content.posts.list({
  status: 'published',
  limit: 10,
});

posts.forEach((post) => {
  console.log(post.title, post.publishedAt);
});
```

## Services

### posts - Post Management

```typescript
// List posts
const { data: posts, meta } = await content.posts.list({
  limit: 20,
  categoryId: 'category-id',
  status: 'published',
});

// Get post by ID
const post = await content.posts.get('post-id');

// Get post by slug
const post = await content.posts.getBySlug('my-post-slug');

// Create post
const newPost = await content.posts.create({
  title: 'My New Post',
  content: 'Post content here...',
  excerpt: 'Short summary',
  slug: 'my-new-post',
  categoryId: 'category-id',
  tagIds: ['tag-1', 'tag-2'],
  status: 'draft',
});

// Update post
const updated = await content.posts.update('post-id', {
  title: 'Updated Title',
  status: 'published',
  publishedAt: new Date().toISOString(),
});

// Delete post
await content.posts.delete('post-id');
```

### comments - Comment Management

```typescript
// List comments for a post
const { data: comments } = await content.comments.list({
  postId: 'post-id',
  status: 'approved',
});

// Get comment by ID
const comment = await content.comments.get('comment-id');

// Create comment
const newComment = await content.comments.create({
  postId: 'post-id',
  content: 'Great article!',
  authorName: 'John Doe',
  authorEmail: 'john@example.com',
});

// Update comment
const updated = await content.comments.update('comment-id', {
  status: 'approved',
});

// Delete comment
await content.comments.delete('comment-id');
```

### categories - Category Management

```typescript
// List categories
const { data: categories } = await content.categories.list();

// Get category by ID
const category = await content.categories.get('category-id');

// Create category
const newCategory = await content.categories.create({
  name: 'Technology',
  slug: 'technology',
  description: 'Technology related posts',
  parentId: null,
});

// Update category
const updated = await content.categories.update('category-id', {
  description: 'Updated description',
});

// Delete category
await content.categories.delete('category-id');
```

### tags - Tag Management

```typescript
// List tags
const { data: tags } = await content.tags.list();

// Get tag by ID
const tag = await content.tags.get('tag-id');

// Create tag
const newTag = await content.tags.create({
  name: 'JavaScript',
  slug: 'javascript',
});

// Update tag
const updated = await content.tags.update('tag-id', {
  name: 'TypeScript',
  slug: 'typescript',
});

// Delete tag
await content.tags.delete('tag-id');
```

## Types

```typescript
import type {
  Post,
  Comment,
  Category,
  Tag,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  CreateCategoryRequest,
  CreateTagRequest,
  ListPostsParams,
} from '@23blocks/block-content';
```

### Post

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Post ID |
| `uniqueId` | `string` | Unique identifier |
| `title` | `string` | Post title |
| `content` | `string` | Post content (HTML/markdown) |
| `excerpt` | `string` | Short summary |
| `slug` | `string` | URL-friendly slug |
| `status` | `string` | draft, published, archived |
| `categoryId` | `string` | Category ID |
| `authorId` | `string` | Author user ID |
| `publishedAt` | `Date` | Publication date |
| `tags` | `Tag[]` | Associated tags |

### Comment

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Comment ID |
| `postId` | `string` | Parent post ID |
| `content` | `string` | Comment content |
| `authorName` | `string` | Author name |
| `authorEmail` | `string` | Author email |
| `status` | `string` | pending, approved, spam |
| `parentId` | `string` | Parent comment ID (for replies) |

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await content.posts.get('invalid-id');
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.NOT_FOUND:
        console.log('Post not found');
        break;
      case ErrorCodes.UNAUTHORIZED:
        console.log('Not authorized to view this post');
        break;
    }
  }
}
```

## Related Packages

- [`@23blocks/block-files`](https://www.npmjs.com/package/@23blocks/block-files) - File uploads for media
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
