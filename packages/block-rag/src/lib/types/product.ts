import type { UnifiedSearchQuery } from './image.js';

/**
 * Request to identify a product from an image
 */
export interface ProductIdentifyRequest {
  file: File | Blob;
  confidenceThreshold?: number;
  categoryHint?: string;
}

/**
 * Response from product identification (custom JSON)
 */
export interface ProductIdentifyResponse {
  success: boolean;
  identified: boolean;
  productId: string | null;
  confidence: number;
  productMetadata: Record<string, unknown> | null;
  alternatives: unknown[];
  message: string;
  queryTimeMs: number;
}

/**
 * Request to search products
 */
export interface ProductSearchRequest {
  query: UnifiedSearchQuery;
}
