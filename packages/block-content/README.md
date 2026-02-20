# @23blocks/block-content

Content block for the 23blocks SDK - blog posts, comments, categories, tags, series, and more.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-content.svg)](https://www.npmjs.com/package/@23blocks/block-content)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-content @23blocks/transport-http
```

## Overview

This package provides comprehensive content management functionality:

- **Posts** - Blog posts and articles with versioning
- **Series** - Collections of ordered posts (tutorials, courses)
- **Comments** - User comments on posts
- **Categories** - Hierarchical content categorization
- **Tags** - Content tagging
- **Users** - Content-specific user profiles
- **Moderation** - Content moderation and flagging
- **Activity** - Activity feeds and engagement tracking

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createContentBlock } from '@23blocks/block-content';

const transport = createHttpTransport({
  baseUrl: 'https://content.yourapp.com',
  headers: () => ({
    'x-api-key': 'your-api-key',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  }),
});

const content = createContentBlock(transport, {
  apiKey: 'your-api-key',
});

// List published posts
const { data: posts } = await content.posts.list({ page: 1, perPage: 10 });

// List series
const { data: series } = await content.series.list({ page: 1, perPage: 10 });
```

## Services

### posts - Post Management

```typescript
// List posts with pagination
const { data: posts, meta } = await content.posts.list({
  page: 1,
  perPage: 20,
});

// Get post by unique ID
const post = await content.posts.get('post-unique-id');

// Create post
const newPost = await content.posts.create({
  title: 'My New Post',
  body: 'Post content here...',
  excerpt: 'Short summary',
  slug: 'my-new-post',
  status: 'draft',
});

// Update post
const updated = await content.posts.update('post-unique-id', {
  title: 'Updated Title',
  status: 'published',
});

// Delete post (soft delete)
await content.posts.delete('post-unique-id');

// Recover deleted post
await content.posts.recover('post-unique-id');

// Search posts
const { data: results } = await content.posts.search('typescript', { page: 1 });

// List deleted posts
const { data: deleted } = await content.posts.listDeleted({ page: 1 });

// Social actions
await content.posts.like('post-unique-id');
await content.posts.dislike('post-unique-id');
await content.posts.save('post-unique-id');
await content.posts.follow('post-unique-id');
```

### series - Series Management

Series allow you to group posts into ordered collections (e.g., tutorials, courses, article series).

```typescript
// List all series
const { data: seriesList, meta } = await content.series.list({
  page: 1,
  perPage: 20,
});

// Query series with filters
const { data: filtered } = await content.series.query({
  visibility: 'public',
  completionStatus: 'ongoing',
  search: 'typescript',
  userUniqueId: 'author-id',
  page: 1,
  perPage: 20,
});

// Get series by unique ID
const series = await content.series.get('series-unique-id');

// Create series
const newSeries = await content.series.create({
  title: 'TypeScript Fundamentals',
  description: 'A complete guide to TypeScript',
  slug: 'typescript-fundamentals',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  imageUrl: 'https://example.com/cover.jpg',
  visibility: 'public',           // 'public' | 'private' | 'unlisted'
  completionStatus: 'ongoing',    // 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
  payload: { difficulty: 'beginner' },
});

// Update series
const updated = await content.series.update('series-unique-id', {
  title: 'TypeScript Masterclass',
  completionStatus: 'completed',
  enabled: true,
  status: 'active',
});

// Delete series
await content.series.delete('series-unique-id');
```

#### Series Social Actions

```typescript
// Like/dislike
const liked = await content.series.like('series-unique-id');
const disliked = await content.series.dislike('series-unique-id');

// Follow/unfollow
const followed = await content.series.follow('series-unique-id');
await content.series.unfollow('series-unique-id');

// Save/unsave (bookmarking)
const saved = await content.series.save('series-unique-id');
await content.series.unsave('series-unique-id');
```

#### Series Post Management

```typescript
// Get all posts in a series (ordered)
const posts = await content.series.getPosts('series-unique-id');

// Add a post to a series with optional sequence number
await content.series.addPost('series-unique-id', 'post-unique-id', 1);

// Remove a post from a series
await content.series.removePost('series-unique-id', 'post-unique-id');

// Reorder posts in a series
const reordered = await content.series.reorderPosts('series-unique-id', {
  posts: [
    { postUniqueId: 'post-1', sequence: 1 },
    { postUniqueId: 'post-2', sequence: 2 },
    { postUniqueId: 'post-3', sequence: 3 },
  ],
});
```

### comments - Comment Management

```typescript
// List comments
const { data: comments } = await content.comments.list({
  page: 1,
  perPage: 50,
});

// Get comment by ID
const comment = await content.comments.get('comment-unique-id');

// Create comment
const newComment = await content.comments.create({
  postUniqueId: 'post-unique-id',
  body: 'Great article!',
  parentUniqueId: null, // For replies, set parent comment ID
});

// Update comment
const updated = await content.comments.update('comment-unique-id', {
  body: 'Updated comment content',
});

// Delete comment
await content.comments.delete('comment-unique-id');

// Like/dislike comments
await content.comments.like('comment-unique-id');
await content.comments.dislike('comment-unique-id');
```

### categories - Category Management

```typescript
// List categories
const { data: categories } = await content.categories.list();

// Get category by ID
const category = await content.categories.get('category-unique-id');

// Create category
const newCategory = await content.categories.create({
  name: 'Technology',
  slug: 'technology',
  description: 'Technology related posts',
  parentUniqueId: null, // For subcategories
});

// Update category
const updated = await content.categories.update('category-unique-id', {
  description: 'Updated description',
});

// Delete category
await content.categories.delete('category-unique-id');

// Recover deleted category
await content.categories.recover('category-unique-id');

// Get child categories
const children = await content.categories.getChildren('parent-category-id');
```

### tags - Tag Management

```typescript
// List tags
const { data: tags } = await content.tags.list();

// Get tag by ID
const tag = await content.tags.get('tag-unique-id');

// Create tag
const newTag = await content.tags.create({
  name: 'JavaScript',
  slug: 'javascript',
});

// Update tag
const updated = await content.tags.update('tag-unique-id', {
  name: 'TypeScript',
  slug: 'typescript',
});

// Delete tag
await content.tags.delete('tag-unique-id');
```

### users - Content User Management

```typescript
// List content users
const { data: users } = await content.users.list({ page: 1 });

// Get user profile
const user = await content.users.get('user-unique-id');

// Register user for content
const registered = await content.users.register('user-unique-id', {
  alias: 'johndoe',
  bio: 'Tech writer',
  avatarUrl: 'https://example.com/avatar.jpg',
});

// Update user profile
const updated = await content.users.update('user-unique-id', {
  bio: 'Senior tech writer',
});

// Get user's posts
const posts = await content.users.getPosts('user-unique-id');

// Get user's drafts
const drafts = await content.users.getDrafts('user-unique-id');

// Get user's comments
const comments = await content.users.getComments('user-unique-id');

// Get user's activities
const activities = await content.users.getActivities('user-unique-id');

// User tags (interests)
await content.users.addTag('user-unique-id', 'tag-unique-id');
await content.users.removeTag('user-unique-id', 'tag-unique-id');

// User following
const followers = await content.users.getFollowers('user-unique-id');
const following = await content.users.getFollowing('user-unique-id');
await content.users.followUser('user-unique-id', 'target-user-id');
await content.users.unfollowUser('user-unique-id', 'target-user-id');
```

### moderation - Content Moderation

```typescript
// Moderate a post
const result = await content.moderation.moderatePost('post-unique-id', {
  action: 'approve', // 'approve' | 'reject' | 'flag'
  reason: 'Content meets guidelines',
});

// Moderate a comment
const result = await content.moderation.moderateComment('comment-unique-id', {
  action: 'reject',
  reason: 'Spam content',
});

// List content flags
const { data: flags } = await content.moderation.listFlags({ page: 1 });

// Create a flag
const flag = await content.moderation.createFlag({
  entityType: 'post',
  entityUniqueId: 'post-unique-id',
  reason: 'inappropriate',
  description: 'Contains offensive language',
});

// Resolve a flag
const resolved = await content.moderation.resolveFlag('flag-unique-id', 'removed');
```

### activities - Activity Feed

```typescript
// Get activities
const { data: activities } = await content.activities.getActivities({
  page: 1,
  perPage: 50,
});

// Get comment activities for a post
const commentActivities = await content.activities.getComments('post-unique-id');

// Get activity feed for a user
const { data: feed } = await content.activities.getFeed('user-unique-id', {
  page: 1,
  perPage: 20,
});
```

### postVersions - Post Version History

```typescript
// List versions of a post
const { data: versions } = await content.postVersions.list('post-unique-id');

// Get specific version
const version = await content.postVersions.get('post-unique-id', 'version-unique-id');

// Restore a version
const restored = await content.postVersions.restore('post-unique-id', 'version-unique-id');
```

## Types

```typescript
import type {
  // Posts
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  ListPostsParams,

  // Series
  Series,
  CreateSeriesRequest,
  UpdateSeriesRequest,
  ListSeriesParams,
  QuerySeriesParams,
  ReorderPostsRequest,
  SeriesVisibility,       // 'public' | 'private' | 'unlisted'
  SeriesCompletionStatus, // 'ongoing' | 'completed' | 'hiatus' | 'cancelled'

  // Comments
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  ListCommentsParams,

  // Categories
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ListCategoriesParams,

  // Tags
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  ListTagsParams,

  // Users
  ContentUser,
  RegisterContentUserRequest,
  UpdateContentUserRequest,
  ListContentUsersParams,
  UserActivity,

  // Moderation
  ModerationResult,
  ModerateContentRequest,
  ContentFlag,
  CreateContentFlagRequest,
  ListContentFlagsParams,

  // Activity
  Activity,
  ListActivitiesParams,

  // Post Versions
  PostVersion,
} from '@23blocks/block-content';
```

### Series Type

| Property | Type | Description |
|----------|------|-------------|
| `uniqueId` | `string` | Unique identifier |
| `title` | `string` | Series title |
| `description` | `string?` | Series description |
| `slug` | `string?` | URL-friendly slug |
| `thumbnailUrl` | `string?` | Thumbnail image URL |
| `imageUrl` | `string?` | Cover image URL |
| `status` | `EntityStatus` | active, inactive, deleted |
| `enabled` | `boolean` | Whether series is enabled |
| `visibility` | `SeriesVisibility` | public, private, unlisted |
| `completionStatus` | `SeriesCompletionStatus` | ongoing, completed, hiatus, cancelled |
| `userUniqueId` | `string?` | Author's unique ID |
| `userName` | `string?` | Author's name |
| `userAlias` | `string?` | Author's alias |
| `postsCount` | `number?` | Number of posts in series |
| `likes` | `number?` | Like count |
| `dislikes` | `number?` | Dislike count |
| `followers` | `number?` | Follower count |
| `savers` | `number?` | Save/bookmark count |
| `payload` | `Record<string, unknown>?` | Custom metadata |

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await content.series.get('invalid-id');
} catch (error) {
  if (isBlockErrorException(error)) {
    // Request tracing
    console.log('Request ID:', error.requestId);
    console.log('Duration:', error.duration);

    switch (error.code) {
      case ErrorCodes.NOT_FOUND:
        console.log('Series not found');
        break;
      case ErrorCodes.UNAUTHORIZED:
        console.log('Not authorized');
        break;
      case ErrorCodes.VALIDATION_ERROR:
        console.log('Validation failed:', error.message);
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
