import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
  createStorageFilesService,
  createEntityFilesService,
  createFileSchemasService,
  createUserFilesService,
  createFileCategoriesService,
  createFileTagsService,
  createDelegationsService,
  createFileAccessService,
  createFileAccessRequestsService,
  type StorageFilesService,
  type EntityFilesService,
  type FileSchemasService,
  type UserFilesService,
  type FileCategoriesService,
  type FileTagsService,
  type DelegationsService,
  type FileAccessService,
  type FileAccessRequestsService,
} from './services/index.js';

/**
 * Configuration for the Files block.
 */
export interface FilesBlockConfig extends BlockConfig {
}

/**
 * File storage and management block interface.
 */
export interface FilesBlock {
  /** Storage file upload and download operations */
  storageFiles: StorageFilesService;
  /** Entity-associated file management */
  entityFiles: EntityFilesService;
  /** File schema definition management */
  fileSchemas: FileSchemasService;
  /** User-associated file management */
  userFiles: UserFilesService;
  /** File category management */
  fileCategories: FileCategoriesService;
  /** File tag management */
  fileTags: FileTagsService;
  /** File delegation management */
  delegations: DelegationsService;
  /** File access control management */
  fileAccess: FileAccessService;
  /** File access request management */
  fileAccessRequests: FileAccessRequestsService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Files block.
 *
 * @example
 * ```typescript
 * const block = createFilesBlock(transport, { apiKey: 'xxx' });
 * const files = await block.storageFiles.list({ page: 1 });
 * ```
 */
export function createFilesBlock(
  transport: Transport,
  config: FilesBlockConfig
): FilesBlock {
  return {
    storageFiles: createStorageFilesService(transport, config),
    entityFiles: createEntityFilesService(transport, config),
    fileSchemas: createFileSchemasService(transport, config),
    userFiles: createUserFilesService(transport, config),
    fileCategories: createFileCategoriesService(transport, config),
    fileTags: createFileTagsService(transport, config),
    delegations: createDelegationsService(transport, config),
    fileAccess: createFileAccessService(transport, config),
    fileAccessRequests: createFileAccessRequestsService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
  };
}

export const filesBlockMetadata: BlockMetadata = {
  name: 'files',
  version: '0.1.0',
  description: 'File storage, upload, download, and file management',
  resourceTypes: [
    'StorageFile',
    'EntityFile',
    'FileSchema',
    'UserFile',
    'FileCategory',
    'FileTag',
    'FileDelegation',
    'FileAccess',
    'FileAccessRequest',
  ],
};
