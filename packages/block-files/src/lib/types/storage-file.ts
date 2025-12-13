import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface StorageFile extends IdentityCore {
  ownerUniqueId: string;
  ownerType: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  mimeType?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  storagePath?: string;
  storageProvider?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
  tags?: string[];
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateStorageFileRequest {
  ownerUniqueId: string;
  ownerType: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  mimeType?: string;
  contentUrl?: string;
  storagePath?: string;
  storageProvider?: string;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateStorageFileRequest {
  fileName?: string;
  fileType?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface ListStorageFilesParams {
  page?: number;
  perPage?: number;
  ownerUniqueId?: string;
  ownerType?: string;
  fileType?: string;
  mimeType?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UploadFileRequest {
  file: File | Blob;
  ownerUniqueId: string;
  ownerType: string;
  fileName?: string;
  fileType?: string;
  generateThumbnail?: boolean;
  generatePreview?: boolean;
  payload?: Record<string, unknown>;
  tags?: string[];
}
