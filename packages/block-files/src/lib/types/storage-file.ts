import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface StorageFile extends IdentityCore {
  name: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  description?: string;
  originalName?: string;
  originalFile?: string;
  virtualFolder?: string;
  categoryName?: string;
  categoryUniqueId?: string;
  isPublic?: boolean;
  accessLevel?: string;
  aiEnabled?: boolean;
  isTemp?: boolean;
  rawContent?: string;
  content?: string;
  fileStructure?: string;
  metadata?: Record<string, unknown>;
  structuredContent?: Record<string, unknown>;
  schemaModel?: string;
  vectorDB?: string;
  isExpirable?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  issuedBy?: string;
  status: EntityStatus;
  enabled: boolean;
  tags?: string[];
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateStorageFileRequest {
  name: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  description?: string;
  originalName?: string;
  originalFile?: string;
  virtualFolder?: string;
  categoryName?: string;
  categoryUniqueId?: string;
  isPublic?: boolean;
  accessLevel?: string;
  aiEnabled?: boolean;
  isTemp?: boolean;
  rawContent?: string;
  content?: string;
  fileStructure?: string;
  metadata?: Record<string, unknown>;
  structuredContent?: Record<string, unknown>;
  schemaModel?: string;
  vectorDB?: string;
  isExpirable?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  issuedBy?: string;
  tags?: string[];
}

export interface UpdateStorageFileRequest {
  name?: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  description?: string;
  originalName?: string;
  originalFile?: string;
  virtualFolder?: string;
  categoryName?: string;
  categoryUniqueId?: string;
  isPublic?: boolean;
  accessLevel?: string;
  aiEnabled?: boolean;
  isTemp?: boolean;
  rawContent?: string;
  content?: string;
  fileStructure?: string;
  metadata?: Record<string, unknown>;
  structuredContent?: Record<string, unknown>;
  schemaModel?: string;
  vectorDB?: string;
  isExpirable?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  issuedBy?: string;
  tags?: string[];
}

export interface ListStorageFilesParams {
  page?: number;
  perPage?: number;
  search?: string;
  ext?: string;
  fileType?: string;
  mimeType?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StoragePresignUploadRequest {
  fileName: string;
}

export interface StoragePresignUploadResponse {
  presignedUrl: string;
  signedUrl: string;
  publicUrl: string;
  fileName: string;
  fileId: string;
  expiresAt: Date;
}
