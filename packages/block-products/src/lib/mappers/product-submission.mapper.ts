import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type {
  ProductSubmission,
  ProductSubmissionImage,
  ProductSubmissionStatus,
} from '../types/product-submission.js';
import { parseString, parseDate, parseOptionalNumber } from './utils.js';

function parseSubmissionStatus(value: unknown): ProductSubmissionStatus {
  const s = parseString(value);
  if (s === 'pending' || s === 'in_review' || s === 'approved' || s === 'rejected' || s === 'duplicate') {
    return s;
  }
  return 'pending';
}

function parseImageUrls(value: unknown): ProductSubmissionImage[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => {
      const img: ProductSubmissionImage = {
        url: String(item['url'] ?? ''),
      };
      if (item['is_primary'] !== undefined && item['is_primary'] !== null) {
        img.isPrimary = Boolean(item['is_primary']);
      }
      if (item['caption'] !== undefined && item['caption'] !== null) {
        img.caption = String(item['caption']);
      }
      return img;
    });
}

export const productSubmissionMapper: ResourceMapper<ProductSubmission> = {
  type: 'product_submission',
  map: (resource) => {
    const a = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(a['unique_id']) || resource.id,
      userUniqueId: a['user_unique_id'] != null ? parseString(a['user_unique_id']) : undefined,
      status: parseSubmissionStatus(a['status']),
      name: parseString(a['name']),
      description: a['description'] != null ? parseString(a['description']) : undefined,
      brand: a['brand'] != null ? parseString(a['brand']) : undefined,
      upc: a['upc'] != null ? parseString(a['upc']) : undefined,
      sku: a['sku'] != null ? parseString(a['sku']) : undefined,
      vintage: a['vintage'] != null ? parseString(a['vintage']) : undefined,
      varietal: a['varietal'] != null ? parseString(a['varietal']) : undefined,
      region: a['region'] != null ? parseString(a['region']) : undefined,
      alcoholContent: parseOptionalNumber(a['alcohol_content']),
      suggestedPrice: parseOptionalNumber(a['suggested_price']),
      priceCurrency: a['price_currency'] != null ? parseString(a['price_currency']) : undefined,
      submissionNotes: a['submission_notes'] != null ? parseString(a['submission_notes']) : undefined,
      foundAtStore: a['found_at_store'] != null ? parseString(a['found_at_store']) : undefined,
      source: a['source'] != null ? parseString(a['source']) : undefined,
      imageUrls: parseImageUrls(a['image_urls']),
      assignedToUserId: a['assigned_to_user_id'] != null ? parseString(a['assigned_to_user_id']) : undefined,
      reviewNotes: a['review_notes'] != null ? parseString(a['review_notes']) : undefined,
      rejectionReason: a['rejection_reason'] != null ? parseString(a['rejection_reason']) : undefined,
      duplicateOfProductId:
        a['duplicate_of_product_id'] != null ? parseString(a['duplicate_of_product_id']) : undefined,
      productUniqueId: a['product_unique_id'] != null ? parseString(a['product_unique_id']) : undefined,
      createdAt: parseDate(a['created_at']),
      updatedAt: parseDate(a['updated_at']),
    };
  },
};
