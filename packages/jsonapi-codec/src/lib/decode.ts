import type { PageResult, PageMeta } from '@23blocks/contracts';
import type { JsonApiDocument, JsonApiMeta } from './types.js';
import { isSingleResourceDocument, isCollectionDocument } from './types.js';
import type { ResourceMapper, IncludedMap } from './mapper.js';
import { buildIncludedMap } from './mapper.js';

/**
 * Decode a single resource from a JSON:API document
 */
export function decodeOne<T>(
  document: JsonApiDocument,
  mapper: ResourceMapper<T>
): T {
  if (!isSingleResourceDocument(document)) {
    throw new Error('Expected single resource document');
  }

  const included = buildIncludedMap(document.included);
  return mapper.map(document.data, included);
}

/**
 * Decode a single resource from a JSON:API document, returning null if not found
 */
export function decodeOneOrNull<T>(
  document: JsonApiDocument,
  mapper: ResourceMapper<T>
): T | null {
  if (!document.data || Array.isArray(document.data)) {
    return null;
  }

  const included = buildIncludedMap(document.included);
  return mapper.map(document.data, included);
}

/**
 * Decode multiple resources from a JSON:API document
 */
export function decodeMany<T>(
  document: JsonApiDocument,
  mapper: ResourceMapper<T>
): T[] {
  if (!isCollectionDocument(document)) {
    throw new Error('Expected collection document');
  }

  const included = buildIncludedMap(document.included);
  return document.data.map((resource) => mapper.map(resource, included));
}

/**
 * Extract pagination metadata from JSON:API meta
 */
export function extractPageMeta(meta?: JsonApiMeta): PageMeta {
  return {
    currentPage: meta?.current_page ?? 1,
    totalPages: meta?.total_pages ?? 1,
    totalCount: meta?.total_count ?? 0,
    perPage: meta?.per_page ?? 0,
  };
}

/**
 * Decode a paginated collection from a JSON:API document
 */
export function decodePageResult<T>(
  document: JsonApiDocument,
  mapper: ResourceMapper<T>
): PageResult<T> {
  const data = isCollectionDocument(document)
    ? decodeMany(document, mapper)
    : [];

  return {
    data,
    meta: extractPageMeta(document.meta),
  };
}

/**
 * Decode with a custom decoder function
 */
export function decodeWith<T>(
  document: JsonApiDocument,
  decoder: (doc: JsonApiDocument, included: IncludedMap) => T
): T {
  const included = buildIncludedMap(document.included);
  return decoder(document, included);
}
