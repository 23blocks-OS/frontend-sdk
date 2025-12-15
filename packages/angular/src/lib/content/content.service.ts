import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createContentBlock,
  type ContentBlock,
  type ContentBlockConfig,
  type Post,
  type CreatePostRequest,
  type UpdatePostRequest,
  type ListPostsParams,
  type Comment,
  type CreateCommentRequest,
  type UpdateCommentRequest,
  type ListCommentsParams,
  type Category,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
  type ListCategoriesParams,
  type Tag,
  type CreateTagRequest,
  type UpdateTagRequest,
  type ListTagsParams,
  type ContentUser,
  type RegisterContentUserRequest,
  type UpdateContentUserRequest,
  type ListContentUsersParams,
  type UserActivity,
} from '@23blocks/block-content';
import { TRANSPORT, CONTENT_TRANSPORT, CONTENT_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Content block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class BlogComponent {
 *   constructor(private content: ContentService) {}
 *
 *   loadPosts() {
 *     this.content.listPosts({ page: 1, perPage: 10 }).subscribe({
 *       next: (result) => console.log('Posts:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly block: ContentBlock | null;

  constructor(
    @Optional() @Inject(CONTENT_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CONTENT_CONFIG) config: ContentBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createContentBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): ContentBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] ContentService is not configured. ' +
        "Add 'urls.content' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Posts Service
  // ───────────────────────────────────────────────────────────────────────────

  listPosts(params?: ListPostsParams): Observable<PageResult<Post>> {
    return from(this.ensureConfigured().posts.list(params));
  }

  getPost(uniqueId: string): Observable<Post> {
    return from(this.ensureConfigured().posts.get(uniqueId));
  }

  createPost(data: CreatePostRequest): Observable<Post> {
    return from(this.ensureConfigured().posts.create(data));
  }

  updatePost(uniqueId: string, data: UpdatePostRequest): Observable<Post> {
    return from(this.ensureConfigured().posts.update(uniqueId, data));
  }

  deletePost(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().posts.delete(uniqueId));
  }

  recoverPost(uniqueId: string): Observable<Post> {
    return from(this.ensureConfigured().posts.recover(uniqueId));
  }

  searchPosts(query: string, params?: ListPostsParams): Observable<PageResult<Post>> {
    return from(this.ensureConfigured().posts.search(query, params));
  }

  listDeletedPosts(params?: ListPostsParams): Observable<PageResult<Post>> {
    return from(this.ensureConfigured().posts.listDeleted(params));
  }

  likePost(uniqueId: string): Observable<Post> {
    return from(this.ensureConfigured().posts.like(uniqueId));
  }

  dislikePost(uniqueId: string): Observable<Post> {
    return from(this.ensureConfigured().posts.dislike(uniqueId));
  }

  savePost(uniqueId: string): Observable<Post> {
    return from(this.ensureConfigured().posts.save(uniqueId));
  }

  followPost(uniqueId: string): Observable<Post> {
    return from(this.ensureConfigured().posts.follow(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Comments Service
  // ───────────────────────────────────────────────────────────────────────────

  listComments(params?: ListCommentsParams): Observable<PageResult<Comment>> {
    return from(this.ensureConfigured().comments.list(params));
  }

  getComment(uniqueId: string): Observable<Comment> {
    return from(this.ensureConfigured().comments.get(uniqueId));
  }

  createComment(data: CreateCommentRequest): Observable<Comment> {
    return from(this.ensureConfigured().comments.create(data));
  }

  updateComment(uniqueId: string, data: UpdateCommentRequest): Observable<Comment> {
    return from(this.ensureConfigured().comments.update(uniqueId, data));
  }

  deleteComment(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().comments.delete(uniqueId));
  }

  likeComment(uniqueId: string): Observable<Comment> {
    return from(this.ensureConfigured().comments.like(uniqueId));
  }

  dislikeComment(uniqueId: string): Observable<Comment> {
    return from(this.ensureConfigured().comments.dislike(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Categories Service
  // ───────────────────────────────────────────────────────────────────────────

  listCategories(params?: ListCategoriesParams): Observable<PageResult<Category>> {
    return from(this.ensureConfigured().categories.list(params));
  }

  getCategory(uniqueId: string): Observable<Category> {
    return from(this.ensureConfigured().categories.get(uniqueId));
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return from(this.ensureConfigured().categories.create(data));
  }

  updateCategory(uniqueId: string, data: UpdateCategoryRequest): Observable<Category> {
    return from(this.ensureConfigured().categories.update(uniqueId, data));
  }

  deleteCategory(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().categories.delete(uniqueId));
  }

  recoverCategory(uniqueId: string): Observable<Category> {
    return from(this.ensureConfigured().categories.recover(uniqueId));
  }

  getCategoryChildren(uniqueId: string): Observable<Category[]> {
    return from(this.ensureConfigured().categories.getChildren(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Tags Service
  // ───────────────────────────────────────────────────────────────────────────

  listTags(params?: ListTagsParams): Observable<PageResult<Tag>> {
    return from(this.ensureConfigured().tags.list(params));
  }

  getTag(uniqueId: string): Observable<Tag> {
    return from(this.ensureConfigured().tags.get(uniqueId));
  }

  createTag(data: CreateTagRequest): Observable<Tag> {
    return from(this.ensureConfigured().tags.create(data));
  }

  updateTag(uniqueId: string, data: UpdateTagRequest): Observable<Tag> {
    return from(this.ensureConfigured().tags.update(uniqueId, data));
  }

  deleteTag(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().tags.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Users Service
  // ───────────────────────────────────────────────────────────────────────────

  listContentUsers(params?: ListContentUsersParams): Observable<PageResult<ContentUser>> {
    return from(this.ensureConfigured().users.list(params));
  }

  getContentUser(uniqueId: string): Observable<ContentUser> {
    return from(this.ensureConfigured().users.get(uniqueId));
  }

  registerContentUser(uniqueId: string, data: RegisterContentUserRequest): Observable<ContentUser> {
    return from(this.ensureConfigured().users.register(uniqueId, data));
  }

  updateContentUser(uniqueId: string, data: UpdateContentUserRequest): Observable<ContentUser> {
    return from(this.ensureConfigured().users.update(uniqueId, data));
  }

  getUserDrafts(uniqueId: string): Observable<Post[]> {
    return from(this.ensureConfigured().users.getDrafts(uniqueId));
  }

  getUserPosts(uniqueId: string): Observable<Post[]> {
    return from(this.ensureConfigured().users.getPosts(uniqueId));
  }

  getUserComments(uniqueId: string): Observable<Comment[]> {
    return from(this.ensureConfigured().users.getComments(uniqueId));
  }

  getUserActivities(uniqueId: string): Observable<UserActivity[]> {
    return from(this.ensureConfigured().users.getActivities(uniqueId));
  }

  addUserTag(uniqueId: string, tagUniqueId: string): Observable<ContentUser> {
    return from(this.ensureConfigured().users.addTag(uniqueId, tagUniqueId));
  }

  removeUserTag(uniqueId: string, tagUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().users.removeTag(uniqueId, tagUniqueId));
  }

  getUserFollowers(uniqueId: string): Observable<ContentUser[]> {
    return from(this.ensureConfigured().users.getFollowers(uniqueId));
  }

  getUserFollowing(uniqueId: string): Observable<ContentUser[]> {
    return from(this.ensureConfigured().users.getFollowing(uniqueId));
  }

  followContentUser(uniqueId: string, targetUserUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().users.followUser(uniqueId, targetUserUniqueId));
  }

  unfollowContentUser(uniqueId: string, targetUserUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().users.unfollowUser(uniqueId, targetUserUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): ContentBlock {
    return this.ensureConfigured();
  }
}
