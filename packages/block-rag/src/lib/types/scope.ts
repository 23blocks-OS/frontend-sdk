/**
 * Available RAG scopes for document processing and querying
 */
export type RagScope = 'entities' | 'accounts' | 'contacts' | 'users' | 'storage' | 'products';

/**
 * Processing mode for document ingestion
 */
export type ProcessingMode = 'ocr_text' | 'face_similarity' | 'visual_general';

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
 * Job response from process endpoints (JSON:API type: ragProcessResponse)
 */
export interface ProcessResponse {
  jobId: string;
  status: string;
  message: string;
}

/**
 * File metadata response
 */
export interface FileMetadata {
  [key: string]: unknown;
}
