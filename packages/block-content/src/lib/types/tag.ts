import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Tag extends IdentityCore {
  uniqueId: string;
  tag: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  slug?: string;
}

// Request types
export interface CreateTagRequest {
  tag: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateTagRequest {
  tag?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListTagsParams {
  page?: number;
  perPage?: number;
  search?: string;
}
