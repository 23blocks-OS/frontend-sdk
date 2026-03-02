import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface EntityFile extends IdentityCore {
  entityUniqueId: string;
  entityType: string;
  fileUniqueId: string;
  name?: string;
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

export interface AttachFileRequest {
  fileUniqueId: string;
  associationType?: string;
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
