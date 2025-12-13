import type { JsonApiResource } from './types.js';

/**
 * Included resources map for efficient relationship resolution
 */
export type IncludedMap = Map<string, JsonApiResource>;

/**
 * Resource mapper interface
 * Each block provides mappers for its resource types
 */
export interface ResourceMapper<T> {
  /** JSON:API resource type this mapper handles */
  type: string;

  /**
   * Map a JSON:API resource to a domain object
   * @param resource - The JSON:API resource to map
   * @param included - Map of included resources for relationship resolution
   */
  map(resource: JsonApiResource, included: IncludedMap): T;
}

/**
 * Create a key for the included map
 */
export function resourceKey(type: string, id: string): string {
  return `${type}:${id}`;
}

/**
 * Build an included map from an array of resources
 */
export function buildIncludedMap(included: JsonApiResource[] = []): IncludedMap {
  const map = new Map<string, JsonApiResource>();
  for (const resource of included) {
    map.set(resourceKey(resource.type, resource.id), resource);
  }
  return map;
}

/**
 * Get a resource from the included map
 */
export function getIncluded(
  included: IncludedMap,
  type: string,
  id: string
): JsonApiResource | undefined {
  return included.get(resourceKey(type, id));
}

/**
 * Resolve a relationship from included resources
 */
export function resolveRelationship<T>(
  resource: JsonApiResource,
  relationshipName: string,
  included: IncludedMap,
  mapper: ResourceMapper<T>
): T | null {
  const relationship = resource.relationships?.[relationshipName];
  if (!relationship?.data) {
    return null;
  }

  const data = relationship.data;
  if (Array.isArray(data)) {
    throw new Error(
      `Expected single relationship for '${relationshipName}', got array. Use resolveRelationshipMany instead.`
    );
  }

  const related = getIncluded(included, data.type, data.id);
  if (!related) {
    return null;
  }

  return mapper.map(related, included);
}

/**
 * Resolve a has-many relationship from included resources
 */
export function resolveRelationshipMany<T>(
  resource: JsonApiResource,
  relationshipName: string,
  included: IncludedMap,
  mapper: ResourceMapper<T>
): T[] {
  const relationship = resource.relationships?.[relationshipName];
  if (!relationship?.data) {
    return [];
  }

  const data = relationship.data;
  if (!Array.isArray(data)) {
    throw new Error(
      `Expected array relationship for '${relationshipName}', got single. Use resolveRelationship instead.`
    );
  }

  return data
    .map((identifier) => {
      const related = getIncluded(included, identifier.type, identifier.id);
      if (!related) {
        return null;
      }
      return mapper.map(related, included);
    })
    .filter((item): item is T => item !== null);
}
