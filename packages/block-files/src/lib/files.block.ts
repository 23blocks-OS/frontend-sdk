import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createStorageFilesService,
  createEntityFilesService,
  createFileSchemasService,
  createUserFilesService,
  type StorageFilesService,
  type EntityFilesService,
  type FileSchemasService,
  type UserFilesService,
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
  ],
};
