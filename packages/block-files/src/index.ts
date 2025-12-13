// Block factory and metadata
export { createFilesBlock, filesBlockMetadata } from './lib/files.block';
export type { FilesBlock, FilesBlockConfig } from './lib/files.block';

// Types
export type {
  // Storage File types
  StorageFile,
  CreateStorageFileRequest,
  UpdateStorageFileRequest,
  ListStorageFilesParams,
  UploadFileRequest,
  // Entity File types
  EntityFile,
  AttachFileRequest,
  UpdateEntityFileRequest,
  ListEntityFilesParams,
  ReorderFilesRequest,
  // File Schema types
  FileSchema,
  CreateFileSchemaRequest,
  UpdateFileSchemaRequest,
  ListFileSchemasParams,
} from './lib/types';

// Services
export type {
  StorageFilesService,
  EntityFilesService,
  FileSchemasService,
} from './lib/services';

export {
  createStorageFilesService,
  createEntityFilesService,
  createFileSchemasService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  storageFileMapper,
  entityFileMapper,
  fileSchemaMapper,
} from './lib/mappers';
