import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Search result entity
 */
export interface SearchResult extends IdentityCore {
  partition: string | null;
  key: string | null;
  weight: number;
  relevance: number;
  uri: string | null;
  origin: string | null;
  entityUniqueId: string;
  entityAlias: string | null;
  entityDescription: string | null;
  entityAvatarUrl: string | null;
  entityType: string;
  entitySource: string | null;
  entityUrl: string | null;
  counter: number;
  favorite: boolean;
  status: EntityStatus;
  payload: Record<string, unknown> | null;
}

/**
 * Search query (saved/executed query)
 */
export interface SearchQuery extends IdentityCore {
  partition: string | null;
  key: string | null;
  query: string;
  include: string[] | null;
  exclude: string[] | null;
  payload: Record<string, unknown> | null;
  userUniqueId: string | null;
  userProviderName: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  userRoleUniqueId: string | null;
  userRoleName: string | null;
  queryString: string | null;
  userAgent: string | null;
  url: string | null;
  path: string | null;
  ipaddress: string | null;
  origin: string | null;
  source: string | null;
  submittedAt: Date | null;
  device: string | null;
  browser: string | null;
  hash: string | null;
  elapsedTime: number | null;
  startedAt: Date | null;
  endedAt: Date | null;
  totalRecords: number;
  totalRecordsReturned: number;
  queryOrigin: string | null;
}

/**
 * Last query (recent search history)
 */
export interface LastQuery extends IdentityCore {
  partition: string | null;
  key: string | null;
  query: string;
  include: string[] | null;
  exclude: string[] | null;
  payload: Record<string, unknown> | null;
  userUniqueId: string | null;
  userProviderName: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  userRoleUniqueId: string | null;
  userRoleName: string | null;
  queryString: string | null;
  userAgent: string | null;
  url: string | null;
  path: string | null;
  ipaddress: string | null;
  origin: string | null;
  source: string | null;
  submittedAt: Date | null;
  device: string | null;
  browser: string | null;
  hash: string | null;
  elapsedTime: number | null;
  startedAt: Date | null;
  endedAt: Date | null;
  totalRecords: number;
  totalRecordsReturned: number;
  queryOrigin: string | null;
}

/**
 * Favorite entity (bookmarked search result)
 */
export interface FavoriteEntity extends IdentityCore {
  partition: string | null;
  key: string | null;
  weight: number;
  relevance: number;
  uri: string | null;
  origin: string | null;
  entityUniqueId: string;
  entityType: string;
  entityAlias: string | null;
  entitySource: string | null;
  entityUrl: string | null;
  entityAvatarUrl: string | null;
  counter: number;
  favorite: boolean;
  status: EntityStatus;
}

/**
 * Entity type (categorization of searchable entities)
 */
export interface EntityType {
  id: string;
  entityType: string;
  entitySource: string | null;
}

/**
 * Search request parameters
 */
export interface SearchRequest {
  query: string;
  entityTypes?: string[];
  include?: string[];
  exclude?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Search response with results and metadata
 */
export interface SearchResponse {
  results: SearchResult[];
  query: SearchQuery;
  totalRecords: number;
  elapsedTime: number;
}

/**
 * Add favorite request
 */
export interface AddFavoriteRequest {
  entityUniqueId: string;
  entityType: string;
  entityAlias?: string;
  entityUrl?: string;
  entityAvatarUrl?: string;
}
