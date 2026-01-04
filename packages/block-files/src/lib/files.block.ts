import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createStorageFilesService,
  createEntityFilesService,
  createFileSchemasService,
  createUserFilesService,
  createFileCategoriesService,
  createFileTagsService,
  createDelegationsService,
  createFileAccessService,
  type StorageFilesService,
  type EntityFilesService,
  type FileSchemasService,
  type UserFilesService,
  type FileCategoriesService,
  type FileTagsService,
  type DelegationsService,
  type FileAccessService,
} from './services';

export interface FilesBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface FilesBlock {
  storageFiles: StorageFilesService;
  entityFiles: EntityFilesService;
  fileSchemas: FileSchemasService;
  userFiles: UserFilesService;
  fileCategories: FileCategoriesService;
  fileTags: FileTagsService;
  delegations: DelegationsService;
  fileAccess: FileAccessService;
}

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
  ],
};
