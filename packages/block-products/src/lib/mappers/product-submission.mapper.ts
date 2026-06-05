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
      // Wire shape is camelCase (`isPrimary`) per the API contract — see
      // msg_1780693590_77019542 from api-products.
      const img: ProductSubmissionImage = {
        url: String(item['url'] ?? ''),
      };
      if (item['isPrimary'] !== undefined && item['isPrimary'] !== null) {
        img.isPrimary = Boolean(item['isPrimary']);
      }
      if (item['caption'] !== undefined && item['caption'] !== null) {
        img.caption = String(item['caption']);
      }
      return img;
    });
}

/**
 * Maps the JSON:API ProductSubmission response. Unlike most 23blocks APIs
 * which emit snake_case attribute keys, this endpoint emits **camelCase**
 * wire keys (confirmed by api-products in msg_1780693590_77019542 —
 * ProductSubmissionSerializer outputs camelCase intentionally to align
 * with the consuming admin tool's display layer).
 */
export const productSubmissionMapper: ResourceMapper<ProductSubmission> = {
  type: 'product_submission',
  map: (resource) => {
    const a = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(a['uniqueId']) || resource.id,
      status: parseSubmissionStatus(a['status']),
      name: parseString(a['name']),
      description: a['description'] != null ? parseString(a['description']) : undefined,
      brand: a['brand'] != null ? parseString(a['brand']) : undefined,
      upc: a['upc'] != null ? parseString(a['upc']) : undefined,
      sku: a['sku'] != null ? parseString(a['sku']) : undefined,
      vintage: parseOptionalNumber(a['vintage']),
      varietal: a['varietal'] != null ? parseString(a['varietal']) : undefined,
      region: a['region'] != null ? parseString(a['region']) : undefined,
      alcoholContent: parseOptionalNumber(a['alcoholContent']),
      suggestedPrice: parseOptionalNumber(a['suggestedPrice']),
      priceCurrency: a['priceCurrency'] != null ? parseString(a['priceCurrency']) : undefined,
      submissionNotes: a['submissionNotes'] != null ? parseString(a['submissionNotes']) : undefined,
      foundAtStore: a['foundAtStore'] != null ? parseString(a['foundAtStore']) : undefined,
      source: a['source'] != null ? parseString(a['source']) : undefined,
      imageUrls: parseImageUrls(a['imageUrls']),

      submittedByUserId: a['submittedByUserId'] != null ? parseString(a['submittedByUserId']) : undefined,
      submittedByEmail: a['submittedByEmail'] != null ? parseString(a['submittedByEmail']) : undefined,
      submittedAt: parseDate(a['submittedAt']),

      assignedToUserId: a['assignedToUserId'] != null ? parseString(a['assignedToUserId']) : undefined,
      assignedAt: parseDate(a['assignedAt']),

      reviewedByUserId: a['reviewedByUserId'] != null ? parseString(a['reviewedByUserId']) : undefined,
      reviewedAt: parseDate(a['reviewedAt']),
      reviewNotes: a['reviewNotes'] != null ? parseString(a['reviewNotes']) : undefined,
      rejectionReason: a['rejectionReason'] != null ? parseString(a['rejectionReason']) : undefined,

      approvedProductId: parseOptionalNumber(a['approvedProductId']),
      approvedProductUniqueId:
        a['approvedProductUniqueId'] != null ? parseString(a['approvedProductUniqueId']) : undefined,
      duplicateOfProductId: parseOptionalNumber(a['duplicateOfProductId']),
      duplicateOfSubmissionId: parseOptionalNumber(a['duplicateOfSubmissionId']),

      metadata: a['metadata'] as Record<string, unknown> | undefined,

      createdAt: parseDate(a['createdAt']),
      updatedAt: parseDate(a['updatedAt']),
    };
  },
};
