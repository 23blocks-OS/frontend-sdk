/**
 * Pagination metadata returned from list operations
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
 * Paginated result wrapper
 */
export interface PageResult<T> {
  /** Array of items for the current page */
  data: T[];
  /** Pagination metadata */
  meta: PageMeta;
}

/**
 * Common pagination request parameters
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of items per page */
  perPage?: number;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort parameter for list operations
 */
export interface SortParam {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Common list request parameters
 */
export interface ListParams extends PaginationParams {
  /** Sort parameters */
  sort?: SortParam | SortParam[];
  /** Filter parameters (key-value pairs) */
  filter?: Record<string, string | number | boolean | string[]>;
  /** Include related resources */
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
