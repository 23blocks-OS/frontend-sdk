import type { IdentityCore } from '@23blocks/contracts';

export interface MessageFile extends IdentityCore {
  conversationUniqueId?: string;
  messageUniqueId?: string;
  name: string;
  originalName?: string;
  contentType?: string;
  size?: number;
  url?: string;
  thumbnailUrl?: string;
  status?: string;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMessageFileRequest {
  name: string;
  contentType?: string;
  size?: number;
  url?: string;
  messageUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface PresignMessageFileRequest {
  filename: string;
  contentType: string;
  size?: number;
}

export interface PresignMessageFileResponse {
  uploadUrl: string;
  fileUrl: string;
  fields?: Record<string, string>;
  expiresAt?: Date;
}

export interface ListMessageFilesParams {
  page?: number;
  perPage?: number;
  contentType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
