import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createSearchBlock,
  type SearchBlock,
  type SearchBlockConfig,
  type SearchResult,
  type SearchQuery,
  type LastQuery,
  type FavoriteEntity,
  type EntityType,
  type SearchRequest,
  type SearchResponse,
  type AddFavoriteRequest,
  type SearchEntity,
  type EntityTypeSchema,
  type RegisterEntityRequest,
  type UpdateEntityRequest,
  type ListEntitiesParams,
  type CopilotSearchRequest,
  type SearchIdentity,
  type RegisterIdentityRequest,
  type UpdateIdentityRequest,
  type ListIdentitiesParams,
} from '@23blocks/block-search';
import { TRANSPORT, SEARCH_TRANSPORT, SEARCH_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Search block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class SearchComponent {
 *   results$ = new BehaviorSubject<SearchResult[]>([]);
 *
 *   constructor(private searchService: SearchService) {}
 *
 *   onSearch(query: string) {
 *     this.searchService.search({ query }).subscribe({
 *       next: (response) => this.results$.next(response.results),
 *       error: (err) => console.error('Search failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly block: SearchBlock | null;

  constructor(
    @Optional() @Inject(SEARCH_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(SEARCH_CONFIG) config: SearchBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createSearchBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): SearchBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] SearchService is not configured. ' +
        "Add 'urls.search' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Search Operations
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Perform a search query
   */
  search(request: SearchRequest): Observable<SearchResponse> {
    return from(this.ensureConfigured().search.search(request));
  }

  /**
   * Get search suggestions for autocomplete
   */
  suggest(query: string, limit?: number): Observable<SearchResult[]> {
    return from(this.ensureConfigured().search.suggest(query, limit));
  }

  /**
   * Get available entity types for filtering
   */
  getEntityTypes(): Observable<EntityType[]> {
    return from(this.ensureConfigured().search.entityTypes());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Search History
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get recent search queries
   */
  getLastQueries(limit?: number): Observable<LastQuery[]> {
    return from(this.ensureConfigured().history.getLastQueries(limit));
  }

  /**
   * Get the full history of search queries
   */
  getQueryHistory(params?: { page?: number; perPage?: number }): Observable<SearchQuery[]> {
    return from(this.ensureConfigured().history.getHistory(params));
  }

  /**
   * Clear search history
   */
  clearHistory(): Observable<void> {
    return from(this.ensureConfigured().history.clear());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Favorites
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List user's favorite entities
   */
  listFavorites(): Observable<FavoriteEntity[]> {
    return from(this.ensureConfigured().favorites.list());
  }

  /**
   * Add an entity to favorites
   */
  addFavorite(request: AddFavoriteRequest): Observable<FavoriteEntity> {
    return from(this.ensureConfigured().favorites.add(request));
  }

  /**
   * Remove an entity from favorites
   */
  removeFavorite(id: string): Observable<void> {
    return from(this.ensureConfigured().favorites.remove(id));
  }

  /**
   * Check if an entity is favorited
   */
  isFavorite(entityUniqueId: string): Observable<boolean> {
    return from(this.ensureConfigured().favorites.isFavorite(entityUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Entities Service
  // ─────────────────────────────────────────────────────────────────────────────

  listEntities(params?: ListEntitiesParams): Observable<PageResult<SearchEntity>> {
    return from(this.ensureConfigured().entities.list(params));
  }

  getEntity(uniqueId: string): Observable<SearchEntity> {
    return from(this.ensureConfigured().entities.get(uniqueId));
  }

  registerEntity(uniqueId: string, data: RegisterEntityRequest): Observable<SearchEntity> {
    return from(this.ensureConfigured().entities.register(uniqueId, data));
  }

  updateEntity(uniqueId: string, data: UpdateEntityRequest): Observable<SearchEntity> {
    return from(this.ensureConfigured().entities.update(uniqueId, data));
  }

  deleteEntity(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entities.delete(uniqueId));
  }

  listRegisteredEntityTypes(): Observable<{ entityType: string }[]> {
    return from(this.ensureConfigured().entities.listEntityTypes());
  }

  getEntityTypeSchema(entityType: string): Observable<EntityTypeSchema> {
    return from(this.ensureConfigured().entities.getEntityTypeSchema(entityType));
  }

  searchByCopilot(data: CopilotSearchRequest): Observable<SearchEntity[]> {
    return from(this.ensureConfigured().entities.searchByCopilot(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Identities Service
  // ─────────────────────────────────────────────────────────────────────────────

  listIdentities(params?: ListIdentitiesParams): Observable<PageResult<SearchIdentity>> {
    return from(this.ensureConfigured().identities.list(params));
  }

  getIdentity(uniqueId: string): Observable<SearchIdentity> {
    return from(this.ensureConfigured().identities.get(uniqueId));
  }

  registerIdentity(uniqueId: string, data: RegisterIdentityRequest): Observable<SearchIdentity> {
    return from(this.ensureConfigured().identities.register(uniqueId, data));
  }

  updateIdentity(uniqueId: string, data: UpdateIdentityRequest): Observable<SearchIdentity> {
    return from(this.ensureConfigured().identities.update(uniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   */
  get rawBlock(): SearchBlock {
    return this.ensureConfigured();
  }
}
