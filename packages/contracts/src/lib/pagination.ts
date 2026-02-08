/**
 * Pagination metadata returned from list operations.
 */
export interface PageMeta {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total count of items across all pages */
  totalCount: number;
  /** Number of items per page */
  perPage: number;
}

/**
 * Paginated result wrapper returned by all `list()` service methods.
 *
 * @example
 * const result = await auth.users.list({ page: 1, perPage: 20 });
 * console.log(result.data);             // User[]
 * console.log(result.meta.totalCount);  // Total users matching filters
 * console.log(result.meta.totalPages);  // Total pages available
 */
export interface PageResult<T> {
  /** Array of items for the current page */
  data: T[];
  /** Pagination metadata */
  meta: PageMeta;
}

/**
 * Common pagination request parameters.
 */
export interface PaginationParams {
  /** Page number (1-indexed). Defaults to 1. */
  page?: number;
  /** Number of items per page. Backend default varies by endpoint. */
  perPage?: number;
}

/**
 * Sort direction.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort parameter for list operations.
 *
 * @example
 * { field: 'created_at', direction: 'desc' }
 */
export interface SortParam {
  /** Field to sort by (use snake_case server field names, e.g., 'created_at') */
  field: string;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Common list request parameters supported by all `list()` methods.
 *
 * @example
 * await service.list({
 *   page: 2,
 *   perPage: 25,
 *   sort: { field: 'created_at', direction: 'desc' },
 *   filter: { status: 'active' },
 *   include: ['role', 'user_profile'],
 * });
 */
export interface ListParams extends PaginationParams {
  /** Sort parameters. Single or multiple sort fields. */
  sort?: SortParam | SortParam[];
  /** Filter parameters as key-value pairs. Keys use snake_case (e.g., `{ status: 'active' }`). */
  filter?: Record<string, string | number | boolean | string[]>;
  /** Related resources to include (sideload). Uses snake_case resource names
   * (e.g., `['role', 'user_avatar', 'user_profile']`). */
  include?: string[];
}

/**
 * Create an empty page result
 */
export function emptyPageResult<T>(): PageResult<T> {
  return {
    data: [],
    meta: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      perPage: 0,
    },
  };
}
