import { Injectable, Inject } from '@angular/core';
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
import { TRANSPORT, ASSETS_CONFIG } from '../tokens.js';

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
  private readonly block: AssetsBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(ASSETS_CONFIG) config: AssetsBlockConfig
  ) {
    this.block = createAssetsBlock(transport, config);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Assets Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssets(params?: ListAssetsParams): Observable<PageResult<Asset>> {
    return from(this.block.assets.list(params));
  }

  getAsset(uniqueId: string): Observable<Asset> {
    return from(this.block.assets.get(uniqueId));
  }

  createAsset(data: CreateAssetRequest): Observable<Asset> {
    return from(this.block.assets.create(data));
  }

  updateAsset(uniqueId: string, data: UpdateAssetRequest): Observable<Asset> {
    return from(this.block.assets.update(uniqueId, data));
  }

  deleteAsset(uniqueId: string): Observable<void> {
    return from(this.block.assets.delete(uniqueId));
  }

  transferAsset(uniqueId: string, data: TransferAssetRequest): Observable<Asset> {
    return from(this.block.assets.transfer(uniqueId, data));
  }

  assignAsset(uniqueId: string, data: AssignAssetRequest): Observable<Asset> {
    return from(this.block.assets.assign(uniqueId, data));
  }

  unassignAsset(uniqueId: string): Observable<Asset> {
    return from(this.block.assets.unassign(uniqueId));
  }

  listAssetsByLocation(locationUniqueId: string, params?: ListAssetsParams): Observable<PageResult<Asset>> {
    return from(this.block.assets.listByLocation(locationUniqueId, params));
  }

  listAssetsByAssignee(assignedToUniqueId: string, params?: ListAssetsParams): Observable<PageResult<Asset>> {
    return from(this.block.assets.listByAssignee(assignedToUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Asset Events Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetEvents(params?: ListAssetEventsParams): Observable<PageResult<AssetEvent>> {
    return from(this.block.events.list(params));
  }

  getAssetEvent(uniqueId: string): Observable<AssetEvent> {
    return from(this.block.events.get(uniqueId));
  }

  createAssetEvent(data: CreateAssetEventRequest): Observable<AssetEvent> {
    return from(this.block.events.create(data));
  }

  updateAssetEvent(uniqueId: string, data: UpdateAssetEventRequest): Observable<AssetEvent> {
    return from(this.block.events.update(uniqueId, data));
  }

  deleteAssetEvent(uniqueId: string): Observable<void> {
    return from(this.block.events.delete(uniqueId));
  }

  listAssetEventsByAsset(assetUniqueId: string, params?: ListAssetEventsParams): Observable<PageResult<AssetEvent>> {
    return from(this.block.events.listByAsset(assetUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Asset Audits Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetAudits(params?: ListAssetAuditsParams): Observable<PageResult<AssetAudit>> {
    return from(this.block.audits.list(params));
  }

  getAssetAudit(uniqueId: string): Observable<AssetAudit> {
    return from(this.block.audits.get(uniqueId));
  }

  createAssetAudit(data: CreateAssetAuditRequest): Observable<AssetAudit> {
    return from(this.block.audits.create(data));
  }

  updateAssetAudit(uniqueId: string, data: UpdateAssetAuditRequest): Observable<AssetAudit> {
    return from(this.block.audits.update(uniqueId, data));
  }

  deleteAssetAudit(uniqueId: string): Observable<void> {
    return from(this.block.audits.delete(uniqueId));
  }

  listAssetAuditsByAsset(assetUniqueId: string, params?: ListAssetAuditsParams): Observable<PageResult<AssetAudit>> {
    return from(this.block.audits.listByAsset(assetUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): AssetsBlock {
    return this.block;
  }
}
