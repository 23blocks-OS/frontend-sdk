/**
 * Request to upload an image for vector indexing
 */
export interface ImageUploadRequest {
  file: File | Blob;
  entityType?: string;
  entityId?: string;
  checkDuplicates?: boolean;
  duplicateThreshold?: number;
}

/**
 * Response from image upload (custom JSON)
 */
export interface ImageUploadResponse {
  success: boolean;
  fileId: string;
  embeddingId: string;
  imageMetadata: Record<string, unknown>;
  message: string;
  duplicateOf: string | null;
  similarityScore: number | null;
}

/**
 * Unified search query for images and products
 */
export interface UnifiedSearchQuery {
  imageUrl?: string;
  imageBase64?: string;
  text?: string;
  limit?: number;
  similarityThreshold?: number;
  textWeight?: number;
  imageWeight?: number;
  filters?: Record<string, unknown>;
}

/**
 * Request to search images
 */
export interface ImageSearchRequest {
  query: UnifiedSearchQuery;
}
