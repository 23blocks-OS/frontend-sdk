import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ProductVariationReview } from '../types/product-variation-review';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber } from './utils';

export const productVariationReviewMapper: ResourceMapper<ProductVariationReview> = {
  type: 'ProductVariationReview',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    productVariationUniqueId: parseString(resource.attributes['product_variation_unique_id']) || '',
    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    userName: parseString(resource.attributes['user_name']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),
    rating: parseNumber(resource.attributes['rating']),
    title: parseString(resource.attributes['title']),
    content: parseString(resource.attributes['content']),
    isVerifiedPurchase: parseBoolean(resource.attributes['is_verified_purchase']),
    helpfulCount: parseNumber(resource.attributes['helpful_count']),
    notHelpfulCount: parseNumber(resource.attributes['not_helpful_count']),
    reviewedAt: parseDate(resource.attributes['reviewed_at']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
