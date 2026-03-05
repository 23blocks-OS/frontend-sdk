import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Tag extends IdentityCore {
  tag: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateTagRequest {
  tag: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  status?: EntityStatus;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
}

export interface UpdateTagRequest {
  tag?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  status?: EntityStatus;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
}
