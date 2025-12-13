import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EntityStatus } from '@23blocks/contracts';
import type {
  SearchResult,
  SearchQuery,
  LastQuery,
  FavoriteEntity,
  EntityType,
} from '../types/index.js';
import { parseString, parseDate, parseNumber, parseBoolean, parseStringArray } from './utils.js';

/**
 * Mapper for SearchResult resources
 */
export const searchResultMapper: ResourceMapper<SearchResult> = {
  type: 'SearchResult',

  map(resource: JsonApiResource, _included: IncludedMap): SearchResult {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      partition: parseString(attrs.partition),
      key: parseString(attrs.key),
      weight: parseNumber(attrs.weight),
      relevance: parseNumber(attrs.relevance),
      uri: parseString(attrs.uri),
      origin: parseString(attrs.origin),
      entityUniqueId: String(attrs.entity_unique_id ?? ''),
      entityAlias: parseString(attrs.entity_alias),
      entityDescription: parseString(attrs.entity_description),
      entityAvatarUrl: parseString(attrs.entity_avatar_url),
      entityType: String(attrs.entity_type ?? ''),
      entitySource: parseString(attrs.entity_source),
      entityUrl: parseString(attrs.entity_url),
      counter: parseNumber(attrs.counter),
      favorite: parseBoolean(attrs.favorite),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};

/**
 * Mapper for SearchQuery resources
 */
export const searchQueryMapper: ResourceMapper<SearchQuery> = {
  type: 'Query',

  map(resource: JsonApiResource, _included: IncludedMap): SearchQuery {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      partition: parseString(attrs.partition),
      key: parseString(attrs.key),
      query: String(attrs.query ?? ''),
      include: parseStringArray(attrs.include),
      exclude: parseStringArray(attrs.exclude),
      payload: attrs.payload as Record<string, unknown> | null,
      userUniqueId: parseString(attrs.user_unique_id),
      userProviderName: parseString(attrs.user_provider_name),
      userName: parseString(attrs.user_name),
      userEmail: parseString(attrs.user_email),
      userRole: parseString(attrs.user_role),
      userRoleUniqueId: parseString(attrs.user_role_unique_id),
      userRoleName: parseString(attrs.user_role_name),
      queryString: parseString(attrs.query_string),
      userAgent: parseString(attrs.user_agent),
      url: parseString(attrs.url),
      path: parseString(attrs.path),
      ipaddress: parseString(attrs.ipaddress),
      origin: parseString(attrs.origin),
      source: parseString(attrs.source),
      submittedAt: parseDate(attrs.submitted_at),
      device: parseString(attrs.device),
      browser: parseString(attrs.browser),
      hash: parseString(attrs.hash),
      elapsedTime: attrs.elapsed_time != null ? parseNumber(attrs.elapsed_time) : null,
      startedAt: parseDate(attrs.started_at),
      endedAt: parseDate(attrs.ended_at),
      totalRecords: parseNumber(attrs.total_records),
      totalRecordsReturned: parseNumber(attrs.total_records_returned),
      queryOrigin: parseString(attrs.query_origin),
    };
  },
};

/**
 * Mapper for LastQuery resources
 */
export const lastQueryMapper: ResourceMapper<LastQuery> = {
  type: 'LastQuery',

  map(resource: JsonApiResource, _included: IncludedMap): LastQuery {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      partition: parseString(attrs.partition),
      key: parseString(attrs.key),
      query: String(attrs.query ?? ''),
      include: parseStringArray(attrs.include),
      exclude: parseStringArray(attrs.exclude),
      payload: attrs.payload as Record<string, unknown> | null,
      userUniqueId: parseString(attrs.user_unique_id),
      userProviderName: parseString(attrs.user_provider_name),
      userName: parseString(attrs.user_name),
      userEmail: parseString(attrs.user_email),
      userRole: parseString(attrs.user_role),
      userRoleUniqueId: parseString(attrs.user_role_unique_id),
      userRoleName: parseString(attrs.user_role_name),
      queryString: parseString(attrs.query_string),
      userAgent: parseString(attrs.user_agent),
      url: parseString(attrs.url),
      path: parseString(attrs.path),
      ipaddress: parseString(attrs.ipaddress),
      origin: parseString(attrs.origin),
      source: parseString(attrs.source),
      submittedAt: parseDate(attrs.submitted_at),
      device: parseString(attrs.device),
      browser: parseString(attrs.browser),
      hash: parseString(attrs.hash),
      elapsedTime: attrs.elapsed_time != null ? parseNumber(attrs.elapsed_time) : null,
      startedAt: parseDate(attrs.started_at),
      endedAt: parseDate(attrs.ended_at),
      totalRecords: parseNumber(attrs.total_records),
      totalRecordsReturned: parseNumber(attrs.total_records_returned),
      queryOrigin: parseString(attrs.query_origin),
    };
  },
};

/**
 * Mapper for FavoriteEntity resources
 */
export const favoriteEntityMapper: ResourceMapper<FavoriteEntity> = {
  type: 'FavoriteEntity',

  map(resource: JsonApiResource, _included: IncludedMap): FavoriteEntity {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      partition: parseString(attrs.partition),
      key: parseString(attrs.key),
      weight: parseNumber(attrs.weight),
      relevance: parseNumber(attrs.relevance),
      uri: parseString(attrs.uri),
      origin: parseString(attrs.origin),
      entityUniqueId: String(attrs.entity_unique_id ?? ''),
      entityType: String(attrs.entity_type ?? ''),
      entityAlias: parseString(attrs.entity_alias),
      entitySource: parseString(attrs.entity_source),
      entityUrl: parseString(attrs.entity_url),
      entityAvatarUrl: parseString(attrs.entity_avatar_url),
      counter: parseNumber(attrs.counter),
      favorite: parseBoolean(attrs.favorite),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
    };
  },
};

/**
 * Mapper for EntityType resources
 */
export const entityTypeMapper: ResourceMapper<EntityType> = {
  type: 'EntityType',

  map(resource: JsonApiResource, _included: IncludedMap): EntityType {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      entityType: String(attrs.entity_type ?? ''),
      entitySource: parseString(attrs.entity_source),
    };
  },
};
