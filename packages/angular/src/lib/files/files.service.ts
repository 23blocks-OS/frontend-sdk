import { Injectable, Inject } from '@angular/core';
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
import { TRANSPORT, FILES_CONFIG } from '../tokens.js';

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
  private readonly block: FilesBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(FILES_CONFIG) config: FilesBlockConfig
  ) {
    this.block = createFilesBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Storage Files Service
  // ─────────────────────────────────────────────────────────────────────────────

  listStorageFiles(params?: ListStorageFilesParams): Observable<PageResult<StorageFile>> {
    return from(this.block.storageFiles.list(params));
  }

  getStorageFile(uniqueId: string): Observable<StorageFile> {
    return from(this.block.storageFiles.get(uniqueId));
  }

  uploadStorageFile(data: UploadFileRequest): Observable<StorageFile> {
    return from(this.block.storageFiles.upload(data));
  }

  createStorageFile(data: CreateStorageFileRequest): Observable<StorageFile> {
    return from(this.block.storageFiles.create(data));
  }

  updateStorageFile(uniqueId: string, data: UpdateStorageFileRequest): Observable<StorageFile> {
    return from(this.block.storageFiles.update(uniqueId, data));
  }

  deleteStorageFile(uniqueId: string): Observable<void> {
    return from(this.block.storageFiles.delete(uniqueId));
  }

  downloadStorageFile(uniqueId: string): Observable<Blob> {
    return from(this.block.storageFiles.download(uniqueId));
  }

  listStorageFilesByOwner(
    ownerUniqueId: string,
    ownerType: string,
    params?: ListStorageFilesParams
  ): Observable<PageResult<StorageFile>> {
    return from(this.block.storageFiles.listByOwner(ownerUniqueId, ownerType, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Entity Files Service
  // ─────────────────────────────────────────────────────────────────────────────

  listEntityFiles(params?: ListEntityFilesParams): Observable<PageResult<EntityFile>> {
    return from(this.block.entityFiles.list(params));
  }

  getEntityFile(uniqueId: string): Observable<EntityFile> {
    return from(this.block.entityFiles.get(uniqueId));
  }

  attachFile(data: AttachFileRequest): Observable<EntityFile> {
    return from(this.block.entityFiles.attach(data));
  }

  detachFile(uniqueId: string): Observable<void> {
    return from(this.block.entityFiles.detach(uniqueId));
  }

  updateEntityFile(uniqueId: string, data: UpdateEntityFileRequest): Observable<EntityFile> {
    return from(this.block.entityFiles.update(uniqueId, data));
  }

  reorderEntityFiles(
    entityUniqueId: string,
    entityType: string,
    data: ReorderFilesRequest
  ): Observable<EntityFile[]> {
    return from(this.block.entityFiles.reorder(entityUniqueId, entityType, data));
  }

  listEntityFilesByEntity(
    entityUniqueId: string,
    entityType: string,
    params?: ListEntityFilesParams
  ): Observable<PageResult<EntityFile>> {
    return from(this.block.entityFiles.listByEntity(entityUniqueId, entityType, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // File Schemas Service
  // ─────────────────────────────────────────────────────────────────────────────

  listFileSchemas(params?: ListFileSchemasParams): Observable<PageResult<FileSchema>> {
    return from(this.block.fileSchemas.list(params));
  }

  getFileSchema(uniqueId: string): Observable<FileSchema> {
    return from(this.block.fileSchemas.get(uniqueId));
  }

  getFileSchemaByCode(code: string): Observable<FileSchema> {
    return from(this.block.fileSchemas.getByCode(code));
  }

  createFileSchema(data: CreateFileSchemaRequest): Observable<FileSchema> {
    return from(this.block.fileSchemas.create(data));
  }

  updateFileSchema(uniqueId: string, data: UpdateFileSchemaRequest): Observable<FileSchema> {
    return from(this.block.fileSchemas.update(uniqueId, data));
  }

  deleteFileSchema(uniqueId: string): Observable<void> {
    return from(this.block.fileSchemas.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): FilesBlock {
    return this.block;
  }
}
