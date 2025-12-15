import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LocationImage extends IdentityCore {
  locationUniqueId: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateLocationImageRequest {
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
  payload?: Record<string, unknown>;
}

export interface PresignLocationImageResponse {
  uploadUrl: string;
  publicUrl: string;
  fields?: Record<string, string>;
}

export interface PresignLocationImageRequest {
  fileName: string;
  contentType: string;
}
