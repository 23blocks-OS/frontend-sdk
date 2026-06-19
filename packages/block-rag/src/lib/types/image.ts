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
  /**
   * Controls whether the RAG service runs YOLO object detection on the
   * query image before searching. **Defaults to `true` server-side.**
   *
   *   - 0–1 objects detected → standard single-image search (automatic fallback)
   *   - 2+ objects detected → multi-object search; each detected object
   *     is searched independently and results are grouped
   *
   * Set to `false` to skip detection entirely (e.g., when the query is
   * pure text or you know the image contains exactly one object). When
   * multi-object behavior triggers, the response's top-level `meta`
   * carries `objects_detected: number`, and each `data[]` item's
   * `attributes` carries `detection_metadata` indicating which detected
   * object the match came from.
   */
  useObjectDetection?: boolean;
}

/**
 * Request to search images
 */
export interface ImageSearchRequest {
  query: UnifiedSearchQuery;
}
