/**
 * JSON:API Resource Object
 * @see https://jsonapi.org/format/#document-resource-objects
 */
export interface JsonApiResource<TAttributes = Record<string, unknown>> {
  /** Resource type */
  type: string;
  /** Resource ID */
  id: string;
  /** Resource attributes */
  attributes?: TAttributes;
  /** Resource relationships */
  relationships?: Record<string, JsonApiRelationship>;
  /** Resource links */
  links?: JsonApiLinks;
  /** Resource meta */
  meta?: Record<string, unknown>;
}

/**
 * JSON:API Relationship Object
 * @see https://jsonapi.org/format/#document-resource-object-relationships
 */
export interface JsonApiRelationship {
  /** Relationship data */
  data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[] | null;
  /** Relationship links */
  links?: JsonApiLinks;
  /** Relationship meta */
  meta?: Record<string, unknown>;
}

/**
 * JSON:API Resource Identifier Object
 * @see https://jsonapi.org/format/#document-resource-identifier-objects
 */
export interface JsonApiResourceIdentifier {
  /** Resource type */
  type: string;
  /** Resource ID */
  id: string;
  /** Identifier meta */
  meta?: Record<string, unknown>;
}

/**
 * JSON:API Links Object
 * @see https://jsonapi.org/format/#document-links
 */
export interface JsonApiLinks {
  self?: string | JsonApiLink;
  related?: string | JsonApiLink;
  first?: string | JsonApiLink | null;
  last?: string | JsonApiLink | null;
  prev?: string | JsonApiLink | null;
  next?: string | JsonApiLink | null;
  [key: string]: string | JsonApiLink | null | undefined;
}

/**
 * JSON:API Link Object
 * @see https://jsonapi.org/format/#document-links
 */
export interface JsonApiLink {
  href: string;
  rel?: string;
  describedby?: string;
  title?: string;
  type?: string;
  hreflang?: string | string[];
  meta?: Record<string, unknown>;
}

/**
 * JSON:API Error Object
 * @see https://jsonapi.org/format/#error-objects
 */
export interface JsonApiError {
  /** Unique identifier for this error */
  id?: string;
  /** Links related to the error */
  links?: {
    about?: string | JsonApiLink;
    type?: string | JsonApiLink;
  };
  /** HTTP status code */
  status?: string;
  /** Application-specific error code */
  code?: string;
  /** Short summary of the error */
  title?: string;
  /** Detailed explanation of the error */
  detail?: string;
  /** Source of the error */
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
  /** Error meta */
  meta?: Record<string, unknown>;
}

/**
 * JSON:API Document
 * @see https://jsonapi.org/format/#document-structure
 */
export interface JsonApiDocument<TAttributes = Record<string, unknown>> {
  /** Primary data */
  data?: JsonApiResource<TAttributes> | JsonApiResource<TAttributes>[] | null;
  /** Included resources */
  included?: JsonApiResource[];
  /** Errors */
  errors?: JsonApiError[];
  /** Top-level meta */
  meta?: JsonApiMeta;
  /** Top-level links */
  links?: JsonApiLinks;
  /** JSON:API version info */
  jsonapi?: {
    version?: string;
    ext?: string[];
    profile?: string[];
    meta?: Record<string, unknown>;
  };
}

/**
 * JSON:API Meta Object (commonly used for pagination)
 */
export interface JsonApiMeta {
  /** Current page number */
  current_page?: number;
  /** Total number of pages */
  total_pages?: number;
  /** Total count of items */
  total_count?: number;
  /** Items per page */
  per_page?: number;
  /** Any additional meta fields */
  [key: string]: unknown;
}

/**
 * Type guard for single resource document
 */
export function isSingleResourceDocument<T>(
  doc: JsonApiDocument<T>
): doc is JsonApiDocument<T> & { data: JsonApiResource<T> } {
  return doc.data !== null && doc.data !== undefined && !Array.isArray(doc.data);
}

/**
 * Type guard for collection resource document
 */
export function isCollectionDocument<T>(
  doc: JsonApiDocument<T>
): doc is JsonApiDocument<T> & { data: JsonApiResource<T>[] } {
  return Array.isArray(doc.data);
}

/**
 * Type guard for error document
 */
export function isErrorDocument(
  doc: JsonApiDocument
): doc is JsonApiDocument & { errors: JsonApiError[] } {
  return Array.isArray(doc.errors) && doc.errors.length > 0;
}
