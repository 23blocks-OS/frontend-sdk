// @ts-nocheck
import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createFilesBlock,
  type FilesBlock,
  type FilesBlockConfig,
  // Storage Files types
  type StorageFile,
  type CreateStorageFileRequest,
  type UpdateStorageFileRequest,
  type ListStorageFilesParams,
  type UploadFileRequest,
  // Entity Files types
  type EntityFile,
  type AttachFileRequest,
  type UpdateEntityFileRequest,
  type ListEntityFilesParams,
  type ReorderFilesRequest,
  // File Schemas types
  type FileSchema,
  type CreateFileSchemaRequest,
  type UpdateFileSchemaRequest,
  type ListFileSchemasParams,
  // User Files types
  type UserFile,
  type ListUserFilesParams,
  type AddUserFileRequest,
  type UpdateUserFileRequest,
  type PresignUploadRequest,
  type PresignUploadResponse,
  type MultipartPresignRequest,
  type MultipartPresignResponse,
  type MultipartCompleteRequest,
  type FileAccess as UserFileAccess,
  type FileAccessRequest as UserFileAccessRequest,
  type FileDelegation as UserFileDelegation,
  type CreateDelegationRequest,
  // File Categories types
  type FileCategory,
  type CreateFileCategoryRequest,
  type UpdateFileCategoryRequest,
  type ListFileCategoriesParams,
  // File Tags types
  type FileTag,
  type CreateFileTagRequest,
  type UpdateFileTagRequest,
  type ListFileTagsParams,
  // Delegations types
  type FileDelegation,
  type CreateFileDelegationRequest,
  type UpdateFileDelegationRequest,
  type ListFileDelegationsParams,
  // File Access types
  type FileAccess,
  type CreateFileAccessRequest,
  type UpdateFileAccessRequest,
  type ListFileAccessParams,
  // File Access Requests types
  type FileAccessRequest,
  type CreateFileAccessRequestInput,
  type ReviewFileAccessRequestInput,
  type ListFileAccessRequestsParams,
} from '@23blocks/block-files';
import { TRANSPORT, FILES_TRANSPORT, FILES_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Files block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class FileUploadComponent {
 *   constructor(private files: FilesService) {}
 *
 *   uploadFile(file: File) {
 *     this.files.uploadStorageFile({
 *       file,
 *       fileName: file.name,
 *       ownerUniqueId: 'user-123',
 *       ownerType: 'User',
 *     }).subscribe({
 *       next: (storageFile) => console.log('Uploaded:', storageFile),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FilesService {
  private readonly block: FilesBlock | null;

  constructor(
    @Optional() @Inject(FILES_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(FILES_CONFIG) config: FilesBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createFilesBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): FilesBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] FilesService is not configured. ' +
        "Add 'urls.files' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Storage Files Service
  // ─────────────────────────────────────────────────────────────────────────────

  listStorageFiles(params?: ListStorageFilesParams): Observable<PageResult<StorageFile>> {
    return from(this.ensureConfigured().storageFiles.list(params));
  }

  getStorageFile(uniqueId: string): Observable<StorageFile> {
    return from(this.ensureConfigured().storageFiles.get(uniqueId));
  }

  uploadStorageFile(data: UploadFileRequest): Observable<StorageFile> {
    return from(this.ensureConfigured().storageFiles.upload(data));
  }

  createStorageFile(data: CreateStorageFileRequest): Observable<StorageFile> {
    return from(this.ensureConfigured().storageFiles.create(data));
  }

  updateStorageFile(uniqueId: string, data: UpdateStorageFileRequest): Observable<StorageFile> {
    return from(this.ensureConfigured().storageFiles.update(uniqueId, data));
  }

  deleteStorageFile(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().storageFiles.delete(uniqueId));
  }

  downloadStorageFile(uniqueId: string): Observable<Blob> {
    return from(this.ensureConfigured().storageFiles.download(uniqueId));
  }

  listStorageFilesByOwner(
    ownerUniqueId: string,
    ownerType: string,
    params?: ListStorageFilesParams
  ): Observable<PageResult<StorageFile>> {
    return from(this.ensureConfigured().storageFiles.listByOwner(ownerUniqueId, ownerType, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Entity Files Service
  // ─────────────────────────────────────────────────────────────────────────────

  listEntityFiles(params?: ListEntityFilesParams): Observable<PageResult<EntityFile>> {
    return from(this.ensureConfigured().entityFiles.list(params));
  }

  getEntityFile(uniqueId: string): Observable<EntityFile> {
    return from(this.ensureConfigured().entityFiles.get(uniqueId));
  }

  attachFile(data: AttachFileRequest): Observable<EntityFile> {
    return from(this.ensureConfigured().entityFiles.attach(data));
  }

  detachFile(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().entityFiles.detach(uniqueId));
  }

  updateEntityFile(uniqueId: string, data: UpdateEntityFileRequest): Observable<EntityFile> {
    return from(this.ensureConfigured().entityFiles.update(uniqueId, data));
  }

  reorderEntityFiles(
    entityUniqueId: string,
    entityType: string,
    data: ReorderFilesRequest
  ): Observable<EntityFile[]> {
    return from(this.ensureConfigured().entityFiles.reorder(entityUniqueId, entityType, data));
  }

  listEntityFilesByEntity(
    entityUniqueId: string,
    entityType: string,
    params?: ListEntityFilesParams
  ): Observable<PageResult<EntityFile>> {
    return from(this.ensureConfigured().entityFiles.listByEntity(entityUniqueId, entityType, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // File Schemas Service
  // ─────────────────────────────────────────────────────────────────────────────

  listFileSchemas(params?: ListFileSchemasParams): Observable<PageResult<FileSchema>> {
    return from(this.ensureConfigured().fileSchemas.list(params));
  }

  getFileSchema(uniqueId: string): Observable<FileSchema> {
    return from(this.ensureConfigured().fileSchemas.get(uniqueId));
  }

  getFileSchemaByCode(code: string): Observable<FileSchema> {
    return from(this.ensureConfigured().fileSchemas.getByCode(code));
  }

  createFileSchema(data: CreateFileSchemaRequest): Observable<FileSchema> {
    return from(this.ensureConfigured().fileSchemas.create(data));
  }

  updateFileSchema(uniqueId: string, data: UpdateFileSchemaRequest): Observable<FileSchema> {
    return from(this.ensureConfigured().fileSchemas.update(uniqueId, data));
  }

  deleteFileSchema(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().fileSchemas.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Files Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List user files
   */
  listUserFiles(userUniqueId: string, params?: ListUserFilesParams): Observable<PageResult<UserFile>> {
    return from(this.ensureConfigured().userFiles.list(userUniqueId, params));
  }

  /**
   * Get a user file
   */
  getUserFile(userUniqueId: string, fileUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.get(userUniqueId, fileUniqueId));
  }

  /**
   * Add a user file
   */
  addUserFile(userUniqueId: string, data: AddUserFileRequest): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.add(userUniqueId, data));
  }

  /**
   * Update a user file
   */
  updateUserFile(userUniqueId: string, fileUniqueId: string, data: UpdateUserFileRequest): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.update(userUniqueId, fileUniqueId, data));
  }

  /**
   * Delete a user file
   */
  deleteUserFile(userUniqueId: string, fileUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().userFiles.delete(userUniqueId, fileUniqueId));
  }

  /**
   * Get presigned upload URL for user file
   */
  presignUserFileUpload(userUniqueId: string, data: PresignUploadRequest): Observable<PresignUploadResponse> {
    return from(this.ensureConfigured().userFiles.presignUpload(userUniqueId, data));
  }

  /**
   * Get presigned URLs for multipart upload
   */
  multipartPresignUserFile(userUniqueId: string, data: MultipartPresignRequest): Observable<MultipartPresignResponse> {
    return from(this.ensureConfigured().userFiles.multipartPresign(userUniqueId, data));
  }

  /**
   * Complete multipart upload for user file
   */
  multipartCompleteUserFile(userUniqueId: string, data: MultipartCompleteRequest): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.multipartComplete(userUniqueId, data));
  }

  /**
   * Approve a user file
   */
  approveUserFile(userUniqueId: string, fileUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.approve(userUniqueId, fileUniqueId));
  }

  /**
   * Reject a user file
   */
  rejectUserFile(userUniqueId: string, fileUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.reject(userUniqueId, fileUniqueId));
  }

  /**
   * Publish a user file
   */
  publishUserFile(userUniqueId: string, fileUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.publish(userUniqueId, fileUniqueId));
  }

  /**
   * Unpublish a user file
   */
  unpublishUserFile(userUniqueId: string, fileUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.unpublish(userUniqueId, fileUniqueId));
  }

  /**
   * Add tag to user file
   */
  addTagToUserFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.addTag(userUniqueId, fileUniqueId, tagUniqueId));
  }

  /**
   * Remove tag from user file
   */
  removeTagFromUserFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().userFiles.removeTag(userUniqueId, fileUniqueId, tagUniqueId));
  }

  /**
   * Bulk update tags for user files
   */
  bulkUpdateUserFileTags(userUniqueId: string, tagUniqueIds: string[]): Observable<void> {
    return from(this.ensureConfigured().userFiles.bulkUpdateTags(userUniqueId, tagUniqueIds));
  }

  /**
   * Request access to a user file
   */
  requestUserFileAccess(userUniqueId: string, fileUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().userFiles.requestAccess(userUniqueId, fileUniqueId));
  }

  /**
   * Get access list for a user file
   */
  getUserFileAccess(userUniqueId: string, fileUniqueId: string): Observable<UserFileAccess[]> {
    return from(this.ensureConfigured().userFiles.getAccess(userUniqueId, fileUniqueId));
  }

  /**
   * Grant access to a user file
   */
  grantUserFileAccess(userUniqueId: string, fileUniqueId: string, data: UserFileAccessRequest): Observable<UserFileAccess> {
    return from(this.ensureConfigured().userFiles.grantAccess(userUniqueId, fileUniqueId, data));
  }

  /**
   * Revoke access to a user file
   */
  revokeUserFileAccess(userUniqueId: string, fileUniqueId: string, accessUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().userFiles.revokeAccess(userUniqueId, fileUniqueId, accessUniqueId));
  }

  /**
   * Make user file public
   */
  makeUserFilePublic(userUniqueId: string, fileUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.makePublic(userUniqueId, fileUniqueId));
  }

  /**
   * Make user file private
   */
  makeUserFilePrivate(userUniqueId: string, fileUniqueId: string): Observable<UserFile> {
    return from(this.ensureConfigured().userFiles.makePrivate(userUniqueId, fileUniqueId));
  }

  /**
   * Bulk grant access to user files
   */
  bulkGrantUserFileAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Observable<void> {
    return from(this.ensureConfigured().userFiles.bulkGrantAccess(userUniqueId, fileUniqueIds, granteeUniqueIds));
  }

  /**
   * Bulk revoke access to user files
   */
  bulkRevokeUserFileAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Observable<void> {
    return from(this.ensureConfigured().userFiles.bulkRevokeAccess(userUniqueId, fileUniqueIds, granteeUniqueIds));
  }

  /**
   * List access requests for a user file
   */
  listUserFileAccessRequests(userUniqueId: string, fileUniqueId: string): Observable<UserFileAccess[]> {
    return from(this.ensureConfigured().userFiles.listAccessRequests(userUniqueId, fileUniqueId));
  }

  /**
   * Approve access request for a user file
   */
  approveUserFileAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Observable<UserFileAccess> {
    return from(this.ensureConfigured().userFiles.approveAccessRequest(userUniqueId, fileUniqueId, requestUniqueId));
  }

  /**
   * Deny access request for a user file
   */
  denyUserFileAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().userFiles.denyAccessRequest(userUniqueId, fileUniqueId, requestUniqueId));
  }

  /**
   * List granted delegations for a user
   */
  listUserGrantedDelegations(userUniqueId: string): Observable<UserFileDelegation[]> {
    return from(this.ensureConfigured().userFiles.listGrantedDelegations(userUniqueId));
  }

  /**
   * List received delegations for a user
   */
  listUserReceivedDelegations(userUniqueId: string): Observable<UserFileDelegation[]> {
    return from(this.ensureConfigured().userFiles.listReceivedDelegations(userUniqueId));
  }

  /**
   * Get a user delegation
   */
  getUserDelegation(userUniqueId: string, delegationUniqueId: string): Observable<UserFileDelegation> {
    return from(this.ensureConfigured().userFiles.getDelegation(userUniqueId, delegationUniqueId));
  }

  /**
   * Create a user delegation
   */
  createUserDelegation(userUniqueId: string, data: CreateDelegationRequest): Observable<UserFileDelegation> {
    return from(this.ensureConfigured().userFiles.createDelegation(userUniqueId, data));
  }

  /**
   * Revoke a user delegation
   */
  revokeUserDelegation(userUniqueId: string, delegationUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().userFiles.revokeDelegation(userUniqueId, delegationUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // File Categories Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List file categories
   */
  listFileCategories(params?: ListFileCategoriesParams): Observable<PageResult<FileCategory>> {
    return from(this.ensureConfigured().fileCategories.list(params));
  }

  /**
   * Get a file category
   */
  getFileCategory(uniqueId: string): Observable<FileCategory> {
    return from(this.ensureConfigured().fileCategories.get(uniqueId));
  }

  /**
   * Create a file category
   */
  createFileCategory(data: CreateFileCategoryRequest): Observable<FileCategory> {
    return from(this.ensureConfigured().fileCategories.create(data));
  }

  /**
   * Update a file category
   */
  updateFileCategory(uniqueId: string, data: UpdateFileCategoryRequest): Observable<FileCategory> {
    return from(this.ensureConfigured().fileCategories.update(uniqueId, data));
  }

  /**
   * Delete a file category
   */
  deleteFileCategory(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().fileCategories.delete(uniqueId));
  }

  /**
   * List children of a file category
   */
  listFileCategoryChildren(parentUniqueId: string): Observable<FileCategory[]> {
    return from(this.ensureConfigured().fileCategories.listChildren(parentUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // File Tags Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List file tags
   */
  listFileTags(params?: ListFileTagsParams): Observable<PageResult<FileTag>> {
    return from(this.ensureConfigured().fileTags.list(params));
  }

  /**
   * Get a file tag
   */
  getFileTag(uniqueId: string): Observable<FileTag> {
    return from(this.ensureConfigured().fileTags.get(uniqueId));
  }

  /**
   * Create a file tag
   */
  createFileTag(data: CreateFileTagRequest): Observable<FileTag> {
    return from(this.ensureConfigured().fileTags.create(data));
  }

  /**
   * Update a file tag
   */
  updateFileTag(uniqueId: string, data: UpdateFileTagRequest): Observable<FileTag> {
    return from(this.ensureConfigured().fileTags.update(uniqueId, data));
  }

  /**
   * Delete a file tag
   */
  deleteFileTag(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().fileTags.delete(uniqueId));
  }

  /**
   * Add a tag to a file
   */
  addFileTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().fileTags.addToFile(userUniqueId, fileUniqueId, tagUniqueId));
  }

  /**
   * Remove a tag from a file
   */
  removeFileTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().fileTags.removeFromFile(userUniqueId, fileUniqueId, tagUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Delegations Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List file delegations for a user
   */
  listDelegations(userUniqueId: string, params?: ListFileDelegationsParams): Observable<PageResult<FileDelegation>> {
    return from(this.ensureConfigured().delegations.list(userUniqueId, params));
  }

  /**
   * Get a file delegation
   */
  getDelegation(userUniqueId: string, uniqueId: string): Observable<FileDelegation> {
    return from(this.ensureConfigured().delegations.get(userUniqueId, uniqueId));
  }

  /**
   * Create a file delegation
   */
  createDelegation(userUniqueId: string, data: CreateFileDelegationRequest): Observable<FileDelegation> {
    return from(this.ensureConfigured().delegations.create(userUniqueId, data));
  }

  /**
   * Update a file delegation
   */
  updateDelegation(userUniqueId: string, uniqueId: string, data: UpdateFileDelegationRequest): Observable<FileDelegation> {
    return from(this.ensureConfigured().delegations.update(userUniqueId, uniqueId, data));
  }

  /**
   * Delete a file delegation
   */
  deleteDelegation(userUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().delegations.delete(userUniqueId, uniqueId));
  }

  /**
   * List received delegations for a user
   */
  listReceivedDelegations(userUniqueId: string): Observable<FileDelegation[]> {
    return from(this.ensureConfigured().delegations.listReceivedDelegations(userUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // File Access Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List file accesses
   */
  listFileAccess(params?: ListFileAccessParams): Observable<PageResult<FileAccess>> {
    return from(this.ensureConfigured().fileAccess.list(params));
  }

  /**
   * Get a file access
   */
  getFileAccess(uniqueId: string): Observable<FileAccess> {
    return from(this.ensureConfigured().fileAccess.get(uniqueId));
  }

  /**
   * Grant file access
   */
  grantFileAccess(data: CreateFileAccessRequest): Observable<FileAccess> {
    return from(this.ensureConfigured().fileAccess.grant(data));
  }

  /**
   * Update file access
   */
  updateFileAccess(uniqueId: string, data: UpdateFileAccessRequest): Observable<FileAccess> {
    return from(this.ensureConfigured().fileAccess.update(uniqueId, data));
  }

  /**
   * Revoke file access
   */
  revokeFileAccess(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().fileAccess.revoke(uniqueId));
  }

  /**
   * List file accesses by file
   */
  listFileAccessByFile(fileUniqueId: string, params?: ListFileAccessParams): Observable<PageResult<FileAccess>> {
    return from(this.ensureConfigured().fileAccess.listByFile(fileUniqueId, params));
  }

  /**
   * List file accesses by grantee
   */
  listFileAccessByGrantee(granteeUniqueId: string, granteeType: string, params?: ListFileAccessParams): Observable<PageResult<FileAccess>> {
    return from(this.ensureConfigured().fileAccess.listByGrantee(granteeUniqueId, granteeType, params));
  }

  /**
   * Check if a grantee has access to a file
   */
  checkFileAccess(fileUniqueId: string, granteeUniqueId: string): Observable<FileAccess | null> {
    return from(this.ensureConfigured().fileAccess.checkAccess(fileUniqueId, granteeUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // File Access Requests Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List file access requests
   */
  listFileAccessRequests(params?: ListFileAccessRequestsParams): Observable<PageResult<FileAccessRequest>> {
    return from(this.ensureConfigured().fileAccessRequests.list(params));
  }

  /**
   * Get a file access request
   */
  getFileAccessRequest(uniqueId: string): Observable<FileAccessRequest> {
    return from(this.ensureConfigured().fileAccessRequests.get(uniqueId));
  }

  /**
   * Create a file access request
   */
  createFileAccessRequest(data: CreateFileAccessRequestInput): Observable<FileAccessRequest> {
    return from(this.ensureConfigured().fileAccessRequests.create(data));
  }

  /**
   * Review (approve/reject) a file access request
   */
  reviewFileAccessRequest(uniqueId: string, review: ReviewFileAccessRequestInput): Observable<FileAccessRequest> {
    return from(this.ensureConfigured().fileAccessRequests.review(uniqueId, review));
  }

  /**
   * Cancel a file access request
   */
  cancelFileAccessRequest(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().fileAccessRequests.cancel(uniqueId));
  }

  /**
   * List access requests for a file
   */
  listAccessRequestsByFile(fileUniqueId: string, params?: ListFileAccessRequestsParams): Observable<PageResult<FileAccessRequest>> {
    return from(this.ensureConfigured().fileAccessRequests.listByFile(fileUniqueId, params));
  }

  /**
   * List access requests by requester
   */
  listAccessRequestsByRequester(requesterUniqueId: string, params?: ListFileAccessRequestsParams): Observable<PageResult<FileAccessRequest>> {
    return from(this.ensureConfigured().fileAccessRequests.listByRequester(requesterUniqueId, params));
  }

  /**
   * Get pending access requests count
   */
  getPendingAccessRequestsCount(): Observable<number> {
    return from(this.ensureConfigured().fileAccessRequests.getPendingCount());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get filesBlock(): FilesBlock {
    return this.ensureConfigured();
  }
}
