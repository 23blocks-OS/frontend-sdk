import { Injectable, Inject } from '@angular/core';
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
} from '@23blocks/block-content';
import { TRANSPORT, CONTENT_CONFIG } from '../tokens.js';

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
  private readonly block: ContentBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(CONTENT_CONFIG) config: ContentBlockConfig
  ) {
    this.block = createContentBlock(transport, config);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Posts Service
  // ───────────────────────────────────────────────────────────────────────────

  listPosts(params?: ListPostsParams): Observable<PageResult<Post>> {
    return from(this.block.posts.list(params));
  }

  getPost(uniqueId: string): Observable<Post> {
    return from(this.block.posts.get(uniqueId));
  }

  createPost(data: CreatePostRequest): Observable<Post> {
    return from(this.block.posts.create(data));
  }

  updatePost(uniqueId: string, data: UpdatePostRequest): Observable<Post> {
    return from(this.block.posts.update(uniqueId, data));
  }

  deletePost(uniqueId: string): Observable<void> {
    return from(this.block.posts.delete(uniqueId));
  }

  recoverPost(uniqueId: string): Observable<Post> {
    return from(this.block.posts.recover(uniqueId));
  }

  searchPosts(query: string, params?: ListPostsParams): Observable<PageResult<Post>> {
    return from(this.block.posts.search(query, params));
  }

  listDeletedPosts(params?: ListPostsParams): Observable<PageResult<Post>> {
    return from(this.block.posts.listDeleted(params));
  }

  likePost(uniqueId: string): Observable<Post> {
    return from(this.block.posts.like(uniqueId));
  }

  dislikePost(uniqueId: string): Observable<Post> {
    return from(this.block.posts.dislike(uniqueId));
  }

  savePost(uniqueId: string): Observable<Post> {
    return from(this.block.posts.save(uniqueId));
  }

  followPost(uniqueId: string): Observable<Post> {
    return from(this.block.posts.follow(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Comments Service
  // ───────────────────────────────────────────────────────────────────────────

  listComments(params?: ListCommentsParams): Observable<PageResult<Comment>> {
    return from(this.block.comments.list(params));
  }

  getComment(uniqueId: string): Observable<Comment> {
    return from(this.block.comments.get(uniqueId));
  }

  createComment(data: CreateCommentRequest): Observable<Comment> {
    return from(this.block.comments.create(data));
  }

  updateComment(uniqueId: string, data: UpdateCommentRequest): Observable<Comment> {
    return from(this.block.comments.update(uniqueId, data));
  }

  deleteComment(uniqueId: string): Observable<void> {
    return from(this.block.comments.delete(uniqueId));
  }

  likeComment(uniqueId: string): Observable<Comment> {
    return from(this.block.comments.like(uniqueId));
  }

  dislikeComment(uniqueId: string): Observable<Comment> {
    return from(this.block.comments.dislike(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Categories Service
  // ───────────────────────────────────────────────────────────────────────────

  listCategories(params?: ListCategoriesParams): Observable<PageResult<Category>> {
    return from(this.block.categories.list(params));
  }

  getCategory(uniqueId: string): Observable<Category> {
    return from(this.block.categories.get(uniqueId));
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return from(this.block.categories.create(data));
  }

  updateCategory(uniqueId: string, data: UpdateCategoryRequest): Observable<Category> {
    return from(this.block.categories.update(uniqueId, data));
  }

  deleteCategory(uniqueId: string): Observable<void> {
    return from(this.block.categories.delete(uniqueId));
  }

  recoverCategory(uniqueId: string): Observable<Category> {
    return from(this.block.categories.recover(uniqueId));
  }

  getCategoryChildren(uniqueId: string): Observable<Category[]> {
    return from(this.block.categories.getChildren(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Tags Service
  // ───────────────────────────────────────────────────────────────────────────

  listTags(params?: ListTagsParams): Observable<PageResult<Tag>> {
    return from(this.block.tags.list(params));
  }

  getTag(uniqueId: string): Observable<Tag> {
    return from(this.block.tags.get(uniqueId));
  }

  createTag(data: CreateTagRequest): Observable<Tag> {
    return from(this.block.tags.create(data));
  }

  updateTag(uniqueId: string, data: UpdateTagRequest): Observable<Tag> {
    return from(this.block.tags.update(uniqueId, data));
  }

  deleteTag(uniqueId: string): Observable<void> {
    return from(this.block.tags.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): ContentBlock {
    return this.block;
  }
}
