import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createAssetsBlock,
  type AssetsBlock,
  type AssetsBlockConfig,
  type Asset,
  type CreateAssetRequest,
  type UpdateAssetRequest,
  type ListAssetsParams,
  type TransferAssetRequest,
  type AssignAssetRequest,
  type AssetEvent,
  type CreateAssetEventRequest,
  type UpdateAssetEventRequest,
  type ListAssetEventsParams,
  type AssetAudit,
  type CreateAssetAuditRequest,
  type UpdateAssetAuditRequest,
  type ListAssetAuditsParams,
} from '@23blocks/block-assets';
import { TRANSPORT, ASSETS_TRANSPORT, ASSETS_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Assets block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class AssetManagementComponent {
 *   constructor(private assets: AssetsService) {}
 *
 *   loadAssets() {
 *     this.assets.listAssets().subscribe({
 *       next: (result) => console.log('Assets:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AssetsService {
  private readonly block: AssetsBlock | null;

  constructor(
    @Optional() @Inject(ASSETS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(ASSETS_CONFIG) config: AssetsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createAssetsBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): AssetsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] AssetsService is not configured. ' +
        "Add 'urls.assets' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Assets Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssets(params?: ListAssetsParams): Observable<PageResult<Asset>> {
    return from(this.ensureConfigured().assets.list(params));
  }

  getAsset(uniqueId: string): Observable<Asset> {
    return from(this.ensureConfigured().assets.get(uniqueId));
  }

  createAsset(data: CreateAssetRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.create(data));
  }

  updateAsset(uniqueId: string, data: UpdateAssetRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.update(uniqueId, data));
  }

  deleteAsset(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().assets.delete(uniqueId));
  }

  transferAsset(uniqueId: string, data: TransferAssetRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.transfer(uniqueId, data));
  }

  assignAsset(uniqueId: string, data: AssignAssetRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.assign(uniqueId, data));
  }

  unassignAsset(uniqueId: string): Observable<Asset> {
    return from(this.ensureConfigured().assets.unassign(uniqueId));
  }

  listAssetsByLocation(locationUniqueId: string, params?: ListAssetsParams): Observable<PageResult<Asset>> {
    return from(this.ensureConfigured().assets.listByLocation(locationUniqueId, params));
  }

  listAssetsByAssignee(assignedToUniqueId: string, params?: ListAssetsParams): Observable<PageResult<Asset>> {
    return from(this.ensureConfigured().assets.listByAssignee(assignedToUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Asset Events Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetEvents(params?: ListAssetEventsParams): Observable<PageResult<AssetEvent>> {
    return from(this.ensureConfigured().events.list(params));
  }

  getAssetEvent(uniqueId: string): Observable<AssetEvent> {
    return from(this.ensureConfigured().events.get(uniqueId));
  }

  createAssetEvent(data: CreateAssetEventRequest): Observable<AssetEvent> {
    return from(this.ensureConfigured().events.create(data));
  }

  updateAssetEvent(uniqueId: string, data: UpdateAssetEventRequest): Observable<AssetEvent> {
    return from(this.ensureConfigured().events.update(uniqueId, data));
  }

  deleteAssetEvent(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().events.delete(uniqueId));
  }

  listAssetEventsByAsset(assetUniqueId: string, params?: ListAssetEventsParams): Observable<PageResult<AssetEvent>> {
    return from(this.ensureConfigured().events.listByAsset(assetUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Asset Audits Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetAudits(params?: ListAssetAuditsParams): Observable<PageResult<AssetAudit>> {
    return from(this.ensureConfigured().audits.list(params));
  }

  getAssetAudit(uniqueId: string): Observable<AssetAudit> {
    return from(this.ensureConfigured().audits.get(uniqueId));
  }

  createAssetAudit(data: CreateAssetAuditRequest): Observable<AssetAudit> {
    return from(this.ensureConfigured().audits.create(data));
  }

  updateAssetAudit(uniqueId: string, data: UpdateAssetAuditRequest): Observable<AssetAudit> {
    return from(this.ensureConfigured().audits.update(uniqueId, data));
  }

  deleteAssetAudit(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().audits.delete(uniqueId));
  }

  listAssetAuditsByAsset(assetUniqueId: string, params?: ListAssetAuditsParams): Observable<PageResult<AssetAudit>> {
    return from(this.ensureConfigured().audits.listByAsset(assetUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): AssetsBlock {
    return this.ensureConfigured();
  }
}
