import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductPromotion extends IdentityCore {
  priceUniqueId?: string;
  code?: string;
  name: string;
  description?: string;
  discountMoney?: number;
  discountPercentage?: number;
  additionalPoints?: number;
  minimumPurchase?: number;
  discountMoneyField?: string;
  discountPercentageField?: string;
  validFrom?: string;
  validTo?: string;
  contentUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  qcode?: string;
  timeZone?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  status: EntityStatus;
}

export interface ListProductPromotionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  productUniqueId?: string;
  promotionType?: string;
  active?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductPromotionRequest {
  priceUniqueId?: string;
  code?: string;
  name: string;
  description?: string;
  discountMoney?: number;
  discountPercentage?: number;
  additionalPoints?: number;
  minimumPurchase?: number;
  discountMoneyField?: string;
  discountPercentageField?: string;
  validFrom?: string;
  validTo?: string;
  contentUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  qcode?: string;
  status?: EntityStatus;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  timeZone?: string;
}

export interface UpdateProductPromotionRequest {
  priceUniqueId?: string;
  code?: string;
  name?: string;
  description?: string;
  discountMoney?: number;
  discountPercentage?: number;
  additionalPoints?: number;
  minimumPurchase?: number;
  discountMoneyField?: string;
  discountPercentageField?: string;
  validFrom?: string;
  validTo?: string;
  contentUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  qcode?: string;
  status?: EntityStatus;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  timeZone?: string;
}
