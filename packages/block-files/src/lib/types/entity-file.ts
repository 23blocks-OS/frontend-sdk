import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface EntityIdentity {
  id: string;
  uniqueId: string;
  entityAlias?: string;
  entityType?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterEntityRequest {
  entityAlias?: string;
  entityType?: string;
  name?: string;
}

export interface EntityFile extends IdentityCore {
  entityUniqueId: string;
  entityType?: string;
  fileUniqueId?: string;
  name?: string;
  originalName?: string;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  imageUrl?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  displayOrder?: number;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateEntityFileRequest {
  name: string;
  originalName?: string;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  imageUrl?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
}

export interface UpdateEntityFileRequest {
  name?: string;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  imageUrl?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
}

export interface ListEntityFilesParams {
  page?: number;
  perPage?: number;
  search?: string;
  fileType?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AssociateFileRequest {
  fileUniqueId: string;
  associationType?: string;
  sourceEntityId?: string;
}

export interface EntityPresignUploadRequest {
  fileName: string;
}

export interface EntityPresignUploadResponse {
  signedUrl: string;
  publicUrl: string;
}

export interface EntityMultipartPresignRequest {
  fileName: string;
  partCount: number;
}

export interface EntityMultipartPresignResponse {
  uploadId: string;
  parts: Array<{
    partNumber: number;
    presignedUrl: string;
  }>;
}

export interface EntityMultipartCompleteRequest {
  fileName: string;
  uploadId: string;
  parts: Array<{
    partNumber: number;
    etag: string;
  }>;
}

export interface EntityMultipartCompleteResponse {
  publicUrl: string;
  fileName: string;
}
