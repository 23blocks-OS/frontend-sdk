import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createFilesBlock,
  type FilesBlock,
  type FilesBlockConfig,
  type StorageFile,
  type CreateStorageFileRequest,
  type UpdateStorageFileRequest,
  type ListStorageFilesParams,
  type UploadFileRequest,
  type EntityFile,
  type AttachFileRequest,
  type UpdateEntityFileRequest,
  type ListEntityFilesParams,
  type ReorderFilesRequest,
  type FileSchema,
  type CreateFileSchemaRequest,
  type UpdateFileSchemaRequest,
  type ListFileSchemasParams,
} from '@23blocks/block-files';
import { TRANSPORT, FILES_TRANSPORT, FILES_CONFIG } from '../tokens.js';

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
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): FilesBlock {
    return this.ensureConfigured();
  }
}
