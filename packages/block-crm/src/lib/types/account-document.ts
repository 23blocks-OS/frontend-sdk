import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface AccountDocument extends IdentityCore {
  accountUniqueId: string;
  name: string;
  originalName?: string;
  description?: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface AddAccountDocumentRequest {
  name: string;
  originalName?: string;
  description?: string;
  fileType?: string;
  fileSize?: number;
  url: string;
  payload?: Record<string, unknown>;
}

export interface PresignDocumentRequest {
  filename: string;
  contentType?: string;
}

export interface PresignDocumentResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export interface MultipartPresignRequest {
  filename: string;
  contentType: string;
  partCount: number;
}

export interface MultipartPresignResponse {
  uploadId: string;
  key: string;
  partUrls: string[];
}

export interface MultipartCompleteRequest {
  uploadId: string;
  key: string;
  parts: Array<{ partNumber: number; etag: string }>;
}

export interface MultipartCompleteResponse {
  url: string;
  publicUrl: string;
}
