/**
 * Available RAG scopes for document processing and querying
 */
export type RagScope = 'entities' | 'accounts' | 'contacts' | 'users' | 'storage' | 'products';

/**
 * Processing mode for document ingestion.
 *
 *   - `ocr_text` — OCR + text-embedding ingestion (default for documents)
 *   - `face_similarity` — face detection + CLIP embedding per face
 *   - `visual_general` — single-image CLIP embedding
 *   - `object_detection` — multi-object detection on a single image; each
 *     detected object gets its own CLIP embedding (useful for shelf-photo
 *     visual search: one photo with multiple products → per-product embeddings).
 *     Returns per-object `objects_detected` count and `detection_metadata`
 *     entries on the process response.
 */
export type ProcessingMode = 'ocr_text' | 'face_similarity' | 'visual_general' | 'object_detection';

/**
 * Request to query documents within a scope
 */
export interface QueryRequest {
  query: string;
  page?: number;
  records?: number;
  minScore?: number;
  entityId?: string;
}

/**
 * A single query result from RAG search (JSON:API type: query_result)
 */
export interface QueryResultChunk {
  id: string;
  score: number;
  text: string;
  fileUniqueId: string;
  fileName: string;
  fileType: string;
  pageNumber: number | null;
  chunkIndex: number;
  entityId: string;
  entityUrl: string;
  fileUrl: string;
  reranked: boolean;
  originalScore: number | null;
  videoTimestamp: number | null;
  videoTimestampFormatted: string | null;
  videoDeepLink: string | null;
}

/**
 * Metadata from a query response
 */
export interface QueryMeta {
  query: string;
  totalResults: number;
  page: number;
  records: number;
  processingTimeMs: number;
  rerankingApplied: boolean;
}

/**
 * Response from a scope query
 */
export interface QueryResponse {
  results: QueryResultChunk[];
  meta: QueryMeta;
}

/**
 * A single detected object in an `object_detection` ingestion. Bounding box
 * coordinates are `[x1, y1, x2, y2]` in image pixels.
 */
export interface ObjectDetection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  objectIndex: number;
  totalObjects: number;
}

/**
 * Job response from process endpoints (JSON:API type: ragProcessResponse).
 *
 * When `processing_mode === 'object_detection'`, the response also carries
 * `objectsDetected` and `detectionMetadata` describing each detected object.
 * Each detected object becomes its own CLIP-embedded chunk that can be
 * found independently via `query()`.
 */
export interface ProcessResponse {
  jobId: string;
  status: string;
  message: string;
  /** Total number of objects detected (only present for `object_detection` mode). */
  objectsDetected?: number;
  /** Per-object detection metadata (only present for `object_detection` mode). */
  detectionMetadata?: ObjectDetection[];
}

/**
 * File metadata response
 */
export interface FileMetadata {
  [key: string]: unknown;
}
