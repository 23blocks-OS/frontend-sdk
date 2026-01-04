import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductVariationReview extends IdentityCore {
  productVariationUniqueId: string;
  productUniqueId: string;
  userUniqueId: string;
  userName?: string;
  userAvatarUrl?: string;
  rating: number;
  title?: string;
  content?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  reviewedAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateVariationReviewRequest {
  rating: number;
  title?: string;
  content?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateVariationReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListVariationReviewsParams {
  page?: number;
  perPage?: number;
  userUniqueId?: string;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  isVerifiedPurchase?: boolean;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
