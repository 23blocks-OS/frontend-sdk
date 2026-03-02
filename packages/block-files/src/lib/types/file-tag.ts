import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileTag extends IdentityCore {
  tag: string;
  uniqueId: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateFileTagRequest {
  tag: string;
  uniqueId?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
}

export interface UpdateFileTagRequest {
  tag?: string;
  uniqueId?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  status?: EntityStatus;
}

export interface ListFileTagsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FileTagAssignment {
  fileUniqueId: string;
  tagUniqueId: string;
}
