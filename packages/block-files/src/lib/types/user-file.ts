import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface UserFile extends IdentityCore {
  userUniqueId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  mimeType?: string;
  url?: string;
  thumbnailUrl?: string;
  schemaUniqueId?: string;
  status: EntityStatus;
  isPublic: boolean;
  payload?: Record<string, unknown>;
}

export interface ListUserFilesParams {
  page?: number;
  perPage?: number;
  status?: string;
  fileType?: string;
  schemaUniqueId?: string;
}

export interface AddUserFileRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  mimeType?: string;
  url: string;
  thumbnailUrl?: string;
  schemaUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateUserFileRequest {
  fileName?: string;
  fileType?: string;
  thumbnailUrl?: string;
  schemaUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface PresignUploadRequest {
  fileName: string;
  fileType: string;
  mimeType?: string;
  schemaUniqueId?: string;
}

export interface PresignUploadResponse {
  presignedUrl: string;
  fileKey: string;
  fields?: Record<string, string>;
  expiresAt: Date;
}

export interface MultipartPresignRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  mimeType?: string;
  partSize?: number;
}

export interface MultipartPresignResponse {
  uploadId: string;
  fileKey: string;
  parts: Array<{
    partNumber: number;
    presignedUrl: string;
  }>;
}

export interface MultipartCompleteRequest {
  uploadId: string;
  fileKey: string;
  parts: Array<{
    partNumber: number;
    etag: string;
  }>;
}

export interface FileAccessRequest {
  granteeUniqueId: string;
  accessType: 'read' | 'write' | 'admin';
  expiresAt?: string;
}

export interface FileAccess {
  uniqueId: string;
  fileUniqueId: string;
  granteeUniqueId: string;
  accessType: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface FileDelegation {
  uniqueId: string;
  granterUniqueId: string;
  granteeUniqueId: string;
  accessLevel: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CreateDelegationRequest {
  granteeUniqueId: string;
  accessLevel: 'read' | 'write' | 'admin';
  expiresAt?: string;
}
