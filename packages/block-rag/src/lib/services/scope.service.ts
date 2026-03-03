import type { Transport } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  RagScope,
  ProcessingMode,
  QueryRequest,
  QueryResponse,
  QueryResultChunk,
  ProcessResponse,
  FileMetadata,
} from '../types/index.js';
import { queryResultChunkMapper, processResponseMapper } from '../mappers/index.js';
import type { RagBlockConfig } from '../rag.block.js';

/**
 * Scope service interface — per-scope document processing and querying.
 *
 * Endpoints follow the pattern:
 * - POST /{scope}/{scopeId}/files/{fileId}/process?processing_mode=...
 * - GET  /{scope}/{scopeId}/files/{fileId}
 * - POST /{scope}/{scopeId}/query
 */
export interface ScopeService {
  /**
   * Process a file within a scope.
   * @param scope - The RAG scope (entities, accounts, contacts, users, storage, products).
   * @param scopeId - The ID of the scope entity (entity_id, account_id, etc.).
   * @param fileId - The file ID to process.
   * @param processingMode - Processing mode: ocr_text, face_similarity, or visual_general.
   * @returns A JSON:API response with job ID and status.
   */
  process(scope: RagScope, scopeId: string, fileId: string, processingMode?: ProcessingMode): Promise<ProcessResponse>;

  /**
   * Get file metadata within a scope.
   * @param scope - The RAG scope.
   * @param scopeId - The ID of the scope entity.
   * @param fileId - The file ID to get metadata for.
   * @returns File metadata.
   */
  getFileMetadata(scope: RagScope, scopeId: string, fileId: string): Promise<FileMetadata>;

  /**
   * Query documents within a scope.
   * @param scope - The RAG scope to query.
   * @param scopeId - The ID of the scope entity.
   * @param data - The query request with search text and optional filters.
   * @returns Query results with matching document chunks and scores.
   */
  query(scope: RagScope, scopeId: string, data: QueryRequest): Promise<QueryResponse>;
}

/**
 * Create the scope service
 */
export function createScopeService(
  transport: Transport,
  _config: RagBlockConfig
): ScopeService {
  return {
    async process(scope: RagScope, scopeId: string, fileId: string, processingMode?: ProcessingMode) {
      const params: Record<string, string> = {};
      if (processingMode) {
        params['processing_mode'] = processingMode;
      }
      const response = await transport.post<JsonApiDocument>(
        `/${scope}/${scopeId}/files/${fileId}/process`,
        undefined,
        { params }
      );
      return decodeOne(response, processResponseMapper);
    },

    async getFileMetadata(scope: RagScope, scopeId: string, fileId: string) {
      return transport.get<FileMetadata>(`/${scope}/${scopeId}/files/${fileId}`);
    },

    async query(scope: RagScope, scopeId: string, data: QueryRequest) {
      const response = await transport.post<JsonApiDocument & {
        meta?: {
          query?: string;
          total_results?: number;
          page?: number;
          records?: number;
          processing_time_ms?: number;
          reranking_applied?: boolean;
        };
      }>(
        `/${scope}/${scopeId}/query`,
        {
          query: data.query,
          page: data.page,
          records: data.records,
          min_score: data.minScore,
          entity_id: data.entityId,
        }
      );

      const results: QueryResultChunk[] = decodeMany(response, queryResultChunkMapper);

      return {
        results,
        meta: {
          query: response.meta?.query ?? data.query,
          totalResults: response.meta?.total_results ?? results.length,
          page: response.meta?.page ?? data.page ?? 1,
          records: response.meta?.records ?? data.records ?? 15,
          processingTimeMs: response.meta?.processing_time_ms ?? 0,
          rerankingApplied: response.meta?.reranking_applied ?? false,
        },
      };
    },
  };
}
