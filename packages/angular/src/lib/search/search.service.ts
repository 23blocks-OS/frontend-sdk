import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport } from '@23blocks/contracts';
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
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   */
  get rawBlock(): SearchBlock {
    return this.ensureConfigured();
  }
}
