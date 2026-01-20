import type { PageResult, PageMeta } from '@23blocks/contracts';
import type { JsonApiDocument, JsonApiMeta } from './types.js';
import { isSingleResourceDocument, isCollectionDocument } from './types.js';
import type { ResourceMapper, IncludedMap } from './mapper.js';
import { buildIncludedMap } from './mapper.js';

/**
 * Decode a single resource from a JSON:API document
 * Accepts unknown to handle transport layer responses that return unknown
 */
export function decodeOne<T>(
  response: unknown,
  mapper: ResourceMapper<T>
): T {
  const document = response as JsonApiDocument;
  if (!isSingleResourceDocument(document)) {
    throw new Error('Expected single resource document');
  }

  const included = buildIncludedMap(document.included);
  return mapper.map(document.data, included);
}

/**
 * Decode a single resource from a JSON:API document, returning null if not found
 * Accepts unknown to handle transport layer responses that return unknown
 */
export function decodeOneOrNull<T>(
  response: unknown,
  mapper: ResourceMapper<T>
): T | null {
  const document = response as JsonApiDocument;
  if (!document.data || Array.isArray(document.data)) {
    return null;
  }

  const included = buildIncludedMap(document.included);
  return mapper.map(document.data, included);
}

/**
 * Decode multiple resources from a JSON:API document
 * Accepts unknown to handle transport layer responses that return unknown
 */
export function decodeMany<T>(
  response: unknown,
  mapper: ResourceMapper<T>
): T[] {
  const document = response as JsonApiDocument;
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
 * Accepts unknown to handle transport layer responses that return unknown
 */
export function decodePageResult<T>(
  response: unknown,
  mapper: ResourceMapper<T>
): PageResult<T> {
  const document = response as JsonApiDocument;
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
 * Accepts unknown to handle transport layer responses that return unknown
 */
export function decodeWith<T>(
  response: unknown,
  decoder: (doc: JsonApiDocument, included: IncludedMap) => T
): T {
  const document = response as JsonApiDocument;
  const included = buildIncludedMap(document.included);
  return decoder(document, included);
}
