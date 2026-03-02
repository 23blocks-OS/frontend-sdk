import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface UserFile extends IdentityCore {
  userUniqueId: string;
  name: string;
  fileType: string;
  fileSize: number;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  imageUrl?: string;
  description?: string;
  originalName?: string;
  originalFile?: string;
  virtualFolder?: string;
  categoryName?: string;
  categoryUniqueId?: string;
  tags?: string;
  isPublic: boolean;
  accessLevel?: string;
  aiEnabled?: boolean;
  isTemp?: boolean;
  rawContent?: string;
  content?: string;
  fileStructure?: string;
  metadata?: Record<string, unknown>;
  structuredContent?: Record<string, unknown>;
  schemaModel?: string;
  isExpirable?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  issuedBy?: string;
  status: EntityStatus;
}

export interface ListUserFilesParams {
  page?: number;
  perPage?: number;
  status?: string;
  fileType?: string;
  schemaUniqueId?: string;
}

export interface AddUserFileRequest {
  name: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  imageUrl?: string;
  description?: string;
  originalName?: string;
  originalFile?: string;
  virtualFolder?: string;
  categoryName?: string;
  categoryUniqueId?: string;
  tags?: string;
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
  isExpirable?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  issuedBy?: string;
}

export interface UpdateUserFileRequest {
  name?: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  imageUrl?: string;
  description?: string;
  originalName?: string;
  originalFile?: string;
  virtualFolder?: string;
  categoryName?: string;
  categoryUniqueId?: string;
  tags?: string;
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
  isExpirable?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  issuedBy?: string;
}

export interface PresignUploadRequest {
  fileName: string;
  serialization?: string;
}

export interface PresignUploadResponse {
  presignedUrl: string;
  fileKey: string;
  fields?: Record<string, string>;
  expiresAt: Date;
}

export interface MultipartPresignRequest {
  fileName: string;
  partCount: number;
  serialization?: string;
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
  fileName: string;
  uploadId: string;
  parts: Array<{
    partNumber: number;
    etag: string;
  }>;
  serialization?: string;
}

export interface UserFileAccessInput {
  userUniqueId: string;
  accessType: 'read' | 'write' | 'admin';
  expiresAt?: string;
  startsAt?: string;
  userUniqueIds?: string[];
}

export interface UserFileAccessGrant {
  uniqueId: string;
  fileUniqueId: string;
  granteeUniqueId: string;
  accessType: string;
  grantedAt: Date;
  expiresAt?: Date;
}

export interface UserFileDelegationGrant {
  uniqueId: string;
  granterUniqueId: string;
  granteeUniqueId: string;
  accessType: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CreateDelegationRequest {
  granteeUserUniqueId: string;
  accessType: 'read' | 'write' | 'admin';
  expiresAt?: string;
  startsAt?: string;
}

export interface UserFileAccessRequestInput {
  userUniqueId: string;
  accessType: 'read' | 'write' | 'admin';
  startsAt?: string;
  expiresAt?: string;
}
