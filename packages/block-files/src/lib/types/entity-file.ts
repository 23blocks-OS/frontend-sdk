import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface EntityFile extends IdentityCore {
  entityUniqueId: string;
  entityType: string;
  fileUniqueId: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  mimeType?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  displayOrder?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface AttachFileRequest {
  entityUniqueId: string;
  entityType: string;
  fileUniqueId: string;
  displayOrder?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateEntityFileRequest {
  displayOrder?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListEntityFilesParams {
  page?: number;
  perPage?: number;
  entityUniqueId?: string;
  entityType?: string;
  fileType?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReorderFilesRequest {
  fileOrders: Array<{
    uniqueId: string;
    displayOrder: number;
  }>;
}
