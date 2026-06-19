import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { QueryResultChunk, ProcessResponse } from '../types/index.js';
import type { JobStatus } from '../types/job.js';
import type { ImageUploadResponse } from '../types/image.js';
import type { ProductIdentifyResponse } from '../types/product.js';
import { parseString, parseNumber } from './utils.js';

/**
 * Mapper for RAG query result chunks (JSON:API type: query_result)
 */
export const queryResultChunkMapper: ResourceMapper<QueryResultChunk> = {
  type: 'query_result',

  map(resource: JsonApiResource, _included: IncludedMap): QueryResultChunk {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      score: parseNumber(attrs.score),
      text: parseString(attrs.text),
      fileUniqueId: parseString(attrs.file_unique_id),
      fileName: parseString(attrs.file_name),
      fileType: parseString(attrs.file_type),
      pageNumber: attrs.page_number != null ? parseNumber(attrs.page_number) : null,
      chunkIndex: parseNumber(attrs.chunk_index),
      entityId: parseString(attrs.entity_id),
      entityUrl: parseString(attrs.entity_url),
      fileUrl: parseString(attrs.file_url),
      reranked: Boolean(attrs.reranked),
      originalScore: attrs.original_score != null ? parseNumber(attrs.original_score) : null,
      videoTimestamp: attrs.video_timestamp != null ? parseNumber(attrs.video_timestamp) : null,
      videoTimestampFormatted: attrs.video_timestamp_formatted != null ? parseString(attrs.video_timestamp_formatted) : null,
      videoDeepLink: attrs.video_deep_link != null ? parseString(attrs.video_deep_link) : null,
    };
  },
};

/**
 * Mapper for RAG process response (JSON:API type: ragProcessResponse).
 *
 * For the `object_detection` processing mode, the response also carries
 * `objects_detected` (count) and `detection_metadata` (per-object info).
 * The mapper surfaces them as optional `objectsDetected` and
 * `detectionMetadata` fields when present.
 */
export const processResponseMapper: ResourceMapper<ProcessResponse> = {
  type: 'ragProcessResponse',

  map(resource: JsonApiResource, _included: IncludedMap): ProcessResponse {
    const attrs = resource.attributes ?? {};
    const detectionRaw = attrs.detection_metadata;
    const result: ProcessResponse = {
      jobId: parseString(attrs.job_id),
      status: parseString(attrs.status),
      message: parseString(attrs.message),
    };
    if (attrs.objects_detected !== undefined && attrs.objects_detected !== null) {
      result.objectsDetected = Number(attrs.objects_detected);
    }
    if (Array.isArray(detectionRaw)) {
      result.detectionMetadata = detectionRaw
        .filter((d): d is Record<string, unknown> => typeof d === 'object' && d !== null)
        .map((d) => ({
          class: String(d['class'] ?? ''),
          confidence: Number(d['confidence'] ?? 0),
          bbox: Array.isArray(d['bbox']) ? (d['bbox'] as [number, number, number, number]) : [0, 0, 0, 0],
          objectIndex: Number(d['object_index'] ?? 0),
          totalObjects: Number(d['total_objects'] ?? 0),
        }));
    }
    return result;
  },
};

/**
 * Mapper for job status (JSON:API type: job)
 */
export const jobStatusMapper: ResourceMapper<JobStatus> = {
  type: 'job',

  map(resource: JsonApiResource, _included: IncludedMap): JobStatus {
    const attrs = resource.attributes ?? {};
    return {
      jobId: parseString(attrs.job_id),
      fileUniqueId: parseString(attrs.file_unique_id),
      fileType: parseString(attrs.file_type),
      status: parseString(attrs.status),
      progressPercentage: attrs.progress_percentage != null ? parseNumber(attrs.progress_percentage) : null,
      progressMessage: attrs.progress_message != null ? parseString(attrs.progress_message) : null,
      totalPages: attrs.total_pages != null ? parseNumber(attrs.total_pages) : null,
      processedPages: attrs.processed_pages != null ? parseNumber(attrs.processed_pages) : null,
      totalChunks: attrs.total_chunks != null ? parseNumber(attrs.total_chunks) : null,
      totalEmbeddings: attrs.total_embeddings != null ? parseNumber(attrs.total_embeddings) : null,
      totalTokensUsed: attrs.total_tokens_used != null ? parseNumber(attrs.total_tokens_used) : null,
      startedAt: attrs.started_at != null ? parseString(attrs.started_at) : null,
      completedAt: attrs.completed_at != null ? parseString(attrs.completed_at) : null,
      processingTimeSeconds: attrs.processing_time_seconds != null ? parseNumber(attrs.processing_time_seconds) : null,
      errorMessage: attrs.error_message != null ? parseString(attrs.error_message) : null,
      retryCount: parseNumber(attrs.retry_count),
      createdAt: parseString(attrs.created_at),
      updatedAt: parseString(attrs.updated_at),
    };
  },
};

/**
 * Mapper for image upload response (JSON:API type: image_upload)
 */
export const imageUploadMapper: ResourceMapper<ImageUploadResponse> = {
  type: 'image_upload',

  map(resource: JsonApiResource, _included: IncludedMap): ImageUploadResponse {
    const attrs = resource.attributes ?? {};
    return {
      success: Boolean(attrs.success),
      fileId: parseString(attrs.file_id),
      embeddingId: parseString(attrs.embedding_id),
      imageMetadata: (attrs.image_metadata as Record<string, unknown>) ?? {},
      message: parseString(attrs.message),
      duplicateOf: attrs.duplicate_of != null ? parseString(attrs.duplicate_of) : null,
      similarityScore: attrs.similarity_score != null ? parseNumber(attrs.similarity_score) : null,
    };
  },
};

/**
 * Mapper for product identify response (JSON:API type: product_identify).
 * Note: query_time_ms is in meta, not attributes.
 */
export const productIdentifyMapper: ResourceMapper<Omit<ProductIdentifyResponse, 'queryTimeMs'>> = {
  type: 'product_identify',

  map(resource: JsonApiResource, _included: IncludedMap): Omit<ProductIdentifyResponse, 'queryTimeMs'> {
    const attrs = resource.attributes ?? {};
    return {
      success: Boolean(attrs.success),
      identified: Boolean(attrs.identified),
      productId: attrs.product_id != null ? parseString(attrs.product_id) : null,
      confidence: parseNumber(attrs.confidence),
      productMetadata: (attrs.product_metadata as Record<string, unknown>) ?? null,
      alternatives: (attrs.alternatives as unknown[]) ?? [],
      message: parseString(attrs.message),
    };
  },
};
