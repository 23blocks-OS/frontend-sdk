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
  type AddToCategoryRequest,
  type AddPartsRequest,
  type RemovePartsRequest,
  type UpdateMaintenanceRequest,
  type LendAssetRequest,
  type CreateOTPRequest,
  type OTPResponse,
  type AssetEvent,
  type CreateAssetEventRequest,
  type UpdateAssetEventRequest,
  type ListAssetEventsParams,
  type EventImagePresignResponse,
  type CreateEventImageRequest,
  type EventImage,
  type EventReportParams,
  type EventReportSummary,
  type EventReportList,
  type AssetAudit,
  type CreateAssetAuditRequest,
  type UpdateAssetAuditRequest,
  type ListAssetAuditsParams,
  type Category,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
  type ListCategoriesParams,
  type CategoryPresignResponse,
  type CreateCategoryImageRequest,
  type CategoryImage,
  type Tag,
  type CreateTagRequest,
  type UpdateTagRequest,
  type ListTagsParams,
  type Vendor,
  type CreateVendorRequest,
  type UpdateVendorRequest,
  type ListVendorsParams,
  type Warehouse,
  type CreateWarehouseRequest,
  type UpdateWarehouseRequest,
  type ListWarehousesParams,
  type AssetsEntity,
  type CreateAssetsEntityRequest,
  type UpdateAssetsEntityRequest,
  type ListAssetsEntitiesParams,
  type EntityAccess,
  type AccessRequest,
  type CreateAccessRequestRequest,
  type AssetOperation,
  type CreateAssetOperationRequest,
  type ListAssetOperationsParams,
  type OperationReportParams,
  type OperationReportSummary,
  type AssetAlert,
  type CreateAssetAlertRequest,
  type AssetsUser,
  type RegisterAssetsUserRequest,
  type UpdateAssetsUserRequest,
  type ListAssetsUsersParams,
  type UserOwnership,
  type AssetPresignResponse,
  type CreateAssetImageRequest,
  type AssetImage,
} from '@23blocks/block-assets';
import { TRANSPORT, ASSETS_TRANSPORT, ASSETS_CONFIG } from '../tokens';

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

  listAssetsTrash(): Observable<PageResult<Asset>> {
    return from(this.ensureConfigured().assets.listTrash());
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

  addAssetToCategory(uniqueId: string, data: AddToCategoryRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.addToCategory(uniqueId, data));
  }

  addAssetParts(uniqueId: string, data: AddPartsRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.addParts(uniqueId, data));
  }

  removeAssetParts(uniqueId: string, data: RemovePartsRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.removeParts(uniqueId, data));
  }

  updateAssetMaintenance(uniqueId: string, data: UpdateMaintenanceRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.updateMaintenance(uniqueId, data));
  }

  lendAsset(uniqueId: string, data: LendAssetRequest): Observable<Asset> {
    return from(this.ensureConfigured().assets.lend(uniqueId, data));
  }

  createAssetOTP(uniqueId: string, data?: CreateOTPRequest): Observable<OTPResponse> {
    return from(this.ensureConfigured().assets.createOTP(uniqueId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Asset Events Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetEvents(assetUniqueId: string, params?: ListAssetEventsParams): Observable<PageResult<AssetEvent>> {
    return from(this.ensureConfigured().events.list(assetUniqueId, params));
  }

  getAssetEvent(assetUniqueId: string, eventUniqueId: string): Observable<AssetEvent> {
    return from(this.ensureConfigured().events.get(assetUniqueId, eventUniqueId));
  }

  createAssetEvent(assetUniqueId: string, data: CreateAssetEventRequest): Observable<AssetEvent> {
    return from(this.ensureConfigured().events.create(assetUniqueId, data));
  }

  updateAssetEvent(assetUniqueId: string, eventUniqueId: string, data: UpdateAssetEventRequest): Observable<AssetEvent> {
    return from(this.ensureConfigured().events.update(assetUniqueId, eventUniqueId, data));
  }

  getEventReportList(params: EventReportParams): Observable<EventReportList> {
    return from(this.ensureConfigured().events.reportList(params));
  }

  getEventReportSummary(params: EventReportParams): Observable<EventReportSummary> {
    return from(this.ensureConfigured().events.reportSummary(params));
  }

  presignEventImage(assetUniqueId: string, eventUniqueId: string): Observable<EventImagePresignResponse> {
    return from(this.ensureConfigured().events.presignImage(assetUniqueId, eventUniqueId));
  }

  createEventImage(assetUniqueId: string, eventUniqueId: string, data: CreateEventImageRequest): Observable<EventImage> {
    return from(this.ensureConfigured().events.createImage(assetUniqueId, eventUniqueId, data));
  }

  deleteEventImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().events.deleteImage(assetUniqueId, eventUniqueId, imageUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Asset Audits Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetAudits(assetUniqueId: string, params?: ListAssetAuditsParams): Observable<PageResult<AssetAudit>> {
    return from(this.ensureConfigured().audits.list(assetUniqueId, params));
  }

  getAssetAudit(assetUniqueId: string, auditUniqueId: string): Observable<AssetAudit> {
    return from(this.ensureConfigured().audits.get(assetUniqueId, auditUniqueId));
  }

  createAssetAudit(assetUniqueId: string, data: CreateAssetAuditRequest): Observable<AssetAudit> {
    return from(this.ensureConfigured().audits.create(assetUniqueId, data));
  }

  updateAssetAudit(assetUniqueId: string, auditUniqueId: string, data: UpdateAssetAuditRequest): Observable<AssetAudit> {
    return from(this.ensureConfigured().audits.update(assetUniqueId, auditUniqueId, data));
  }

  deleteAssetAudit(assetUniqueId: string, auditUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().audits.delete(assetUniqueId, auditUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Categories Service
  // ───────────────────────────────────────────────────────────────────────────

  listCategories(params?: ListCategoriesParams): Observable<PageResult<Category>> {
    return from(this.ensureConfigured().categories.list(params));
  }

  getCategory(uniqueId: string): Observable<Category> {
    return from(this.ensureConfigured().categories.get(uniqueId));
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return from(this.ensureConfigured().categories.create(data));
  }

  updateCategory(uniqueId: string, data: UpdateCategoryRequest): Observable<Category> {
    return from(this.ensureConfigured().categories.update(uniqueId, data));
  }

  deleteCategory(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().categories.delete(uniqueId));
  }

  deleteCategoryCascade(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().categories.deleteCascade(uniqueId));
  }

  presignCategoryImage(uniqueId: string): Observable<CategoryPresignResponse> {
    return from(this.ensureConfigured().categories.presignImage(uniqueId));
  }

  createCategoryImage(uniqueId: string, data: CreateCategoryImageRequest): Observable<CategoryImage> {
    return from(this.ensureConfigured().categories.createImage(uniqueId, data));
  }

  deleteCategoryImage(uniqueId: string, imageUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().categories.deleteImage(uniqueId, imageUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Tags Service
  // ───────────────────────────────────────────────────────────────────────────

  listTags(params?: ListTagsParams): Observable<PageResult<Tag>> {
    return from(this.ensureConfigured().tags.list(params));
  }

  getTag(uniqueId: string): Observable<Tag> {
    return from(this.ensureConfigured().tags.get(uniqueId));
  }

  createTag(data: CreateTagRequest): Observable<Tag> {
    return from(this.ensureConfigured().tags.create(data));
  }

  updateTag(uniqueId: string, data: UpdateTagRequest): Observable<Tag> {
    return from(this.ensureConfigured().tags.update(uniqueId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Vendors Service
  // ───────────────────────────────────────────────────────────────────────────

  listVendors(params?: ListVendorsParams): Observable<PageResult<Vendor>> {
    return from(this.ensureConfigured().vendors.list(params));
  }

  getVendor(uniqueId: string): Observable<Vendor> {
    return from(this.ensureConfigured().vendors.get(uniqueId));
  }

  createVendor(data: CreateVendorRequest): Observable<Vendor> {
    return from(this.ensureConfigured().vendors.create(data));
  }

  updateVendor(uniqueId: string, data: UpdateVendorRequest): Observable<Vendor> {
    return from(this.ensureConfigured().vendors.update(uniqueId, data));
  }

  deleteVendor(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().vendors.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Warehouses Service
  // ───────────────────────────────────────────────────────────────────────────

  listWarehouses(params?: ListWarehousesParams): Observable<PageResult<Warehouse>> {
    return from(this.ensureConfigured().warehouses.list(params));
  }

  getWarehouse(uniqueId: string): Observable<Warehouse> {
    return from(this.ensureConfigured().warehouses.get(uniqueId));
  }

  createWarehouse(data: CreateWarehouseRequest): Observable<Warehouse> {
    return from(this.ensureConfigured().warehouses.create(data));
  }

  updateWarehouse(uniqueId: string, data: UpdateWarehouseRequest): Observable<Warehouse> {
    return from(this.ensureConfigured().warehouses.update(uniqueId, data));
  }

  deleteWarehouse(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().warehouses.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Entities Service
  // ───────────────────────────────────────────────────────────────────────────

  listEntities(params?: ListAssetsEntitiesParams): Observable<PageResult<AssetsEntity>> {
    return from(this.ensureConfigured().entities.list(params));
  }

  getEntity(uniqueId: string): Observable<AssetsEntity> {
    return from(this.ensureConfigured().entities.get(uniqueId));
  }

  createEntity(data: CreateAssetsEntityRequest): Observable<AssetsEntity> {
    return from(this.ensureConfigured().entities.create(data));
  }

  updateEntity(uniqueId: string, data: UpdateAssetsEntityRequest): Observable<AssetsEntity> {
    return from(this.ensureConfigured().entities.update(uniqueId, data));
  }

  deleteEntity(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entities.delete(uniqueId));
  }

  listEntityAccesses(uniqueId: string): Observable<EntityAccess[]> {
    return from(this.ensureConfigured().entities.listAccesses(uniqueId));
  }

  getEntityAccess(uniqueId: string): Observable<EntityAccess> {
    return from(this.ensureConfigured().entities.getAccess(uniqueId));
  }

  makeEntityPublic(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entities.makePublic(uniqueId));
  }

  revokeEntityAccess(uniqueId: string, accessUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entities.revokeAccess(uniqueId, accessUniqueId));
  }

  requestEntityAccess(uniqueId: string, data: CreateAccessRequestRequest): Observable<AccessRequest> {
    return from(this.ensureConfigured().entities.requestAccess(uniqueId, data));
  }

  listEntityAccessRequests(uniqueId: string): Observable<AccessRequest[]> {
    return from(this.ensureConfigured().entities.listAccessRequests(uniqueId));
  }

  approveEntityAccessRequest(uniqueId: string, requestUniqueId: string): Observable<AccessRequest> {
    return from(this.ensureConfigured().entities.approveAccessRequest(uniqueId, requestUniqueId));
  }

  denyEntityAccessRequest(uniqueId: string, requestUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entities.denyAccessRequest(uniqueId, requestUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Operations Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetOperations(assetUniqueId: string, params?: ListAssetOperationsParams): Observable<PageResult<AssetOperation>> {
    return from(this.ensureConfigured().operations.list(assetUniqueId, params));
  }

  getAssetOperation(assetUniqueId: string, operationUniqueId: string): Observable<AssetOperation> {
    return from(this.ensureConfigured().operations.get(assetUniqueId, operationUniqueId));
  }

  createAssetOperation(assetUniqueId: string, data: CreateAssetOperationRequest): Observable<AssetOperation> {
    return from(this.ensureConfigured().operations.create(assetUniqueId, data));
  }

  getOperationReportSummary(params: OperationReportParams): Observable<OperationReportSummary> {
    return from(this.ensureConfigured().operations.reportSummary(params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Alerts Service
  // ───────────────────────────────────────────────────────────────────────────

  getAlert(uniqueId: string): Observable<AssetAlert> {
    return from(this.ensureConfigured().alerts.get(uniqueId));
  }

  createAlert(data: CreateAssetAlertRequest): Observable<AssetAlert> {
    return from(this.ensureConfigured().alerts.create(data));
  }

  deleteAlert(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().alerts.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Users Service
  // ───────────────────────────────────────────────────────────────────────────

  listAssetsUsers(params?: ListAssetsUsersParams): Observable<PageResult<AssetsUser>> {
    return from(this.ensureConfigured().users.list(params));
  }

  getAssetsUser(uniqueId: string): Observable<AssetsUser> {
    return from(this.ensureConfigured().users.get(uniqueId));
  }

  registerAssetsUser(uniqueId: string, data: RegisterAssetsUserRequest): Observable<AssetsUser> {
    return from(this.ensureConfigured().users.register(uniqueId, data));
  }

  updateAssetsUser(uniqueId: string, data: UpdateAssetsUserRequest): Observable<AssetsUser> {
    return from(this.ensureConfigured().users.update(uniqueId, data));
  }

  listUserEntities(uniqueId: string): Observable<AssetsEntity[]> {
    return from(this.ensureConfigured().users.listEntities(uniqueId));
  }

  listUserAssets(uniqueId: string): Observable<Asset[]> {
    return from(this.ensureConfigured().users.listAssets(uniqueId));
  }

  listUserOwnership(uniqueId: string): Observable<UserOwnership[]> {
    return from(this.ensureConfigured().users.listOwnership(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Images Service
  // ───────────────────────────────────────────────────────────────────────────

  presignAssetImage(assetUniqueId: string): Observable<AssetPresignResponse> {
    return from(this.ensureConfigured().images.presign(assetUniqueId));
  }

  createAssetImage(assetUniqueId: string, data: CreateAssetImageRequest): Observable<AssetImage> {
    return from(this.ensureConfigured().images.create(assetUniqueId, data));
  }

  deleteAssetImage(assetUniqueId: string, imageUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().images.delete(assetUniqueId, imageUniqueId));
  }

  presignAssetEventImage(assetUniqueId: string, eventUniqueId: string): Observable<AssetPresignResponse> {
    return from(this.ensureConfigured().images.presignEvent(assetUniqueId, eventUniqueId));
  }

  createAssetEventImage(assetUniqueId: string, eventUniqueId: string, data: CreateAssetImageRequest): Observable<AssetImage> {
    return from(this.ensureConfigured().images.createEventImage(assetUniqueId, eventUniqueId, data));
  }

  deleteAssetEventImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().images.deleteEventImage(assetUniqueId, eventUniqueId, imageUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get assetsBlock(): AssetsBlock {
    return this.ensureConfigured();
  }
}
