import type { Transport, BlockConfig, HealthCheckResponse } from '@23blocks/contracts';
import {
  createScopeService,
  createRagFilesService,
  createJobsService,
  createImagesService,
  createRagProductsService,
  type ScopeService,
  type RagFilesService,
  type JobsService,
  type ImagesService,
  type RagProductsService,
} from './services/index.js';

/**
 * Configuration for the RAG block
 */
export interface RagBlockConfig extends BlockConfig {}

/**
 * RAG block interface
 */
export interface RagBlock {
  /**
   * Per-scope document processing and querying
   */
  scope: ScopeService;

  /**
   * Generic file processing
   */
  files: RagFilesService;

  /**
   * Job status tracking
   */
  jobs: JobsService;

  /**
   * Image upload and search
   */
  images: ImagesService;

  /**
   * Product identification and search
   */
  products: RagProductsService;

  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the RAG block
 *
 * @example
 * ```typescript
 * import { createRagBlock } from '@23blocks/block-rag';
 * import { createHttpTransport } from '@23blocks/transport-http';
 *
 * const transport = createHttpTransport({
 *   baseUrl: 'https://rag.example.com',
 *   headers: () => ({
 *     'Authorization': `Bearer ${getToken()}`,
 *     'x-api-key': 'your-api-key',
 *   }),
 * });
 *
 * const ragBlock = createRagBlock(transport, { apiKey: 'your-api-key' });
 *
 * // Process a document
 * const job = await ragBlock.scope.process('entities', {
 *   fileUrl: 'https://storage.example.com/doc.pdf',
 *   fileType: 'pdf',
 * });
 *
 * // Check job status
 * const status = await ragBlock.jobs.get(job.jobId);
 *
 * // Query documents
 * const results = await ragBlock.scope.query('entities', {
 *   query: 'What is the revenue?',
 * });
 *
 * // Search images
 * const images = await ragBlock.images.search({
 *   query: { text: 'sunset', limit: 10 },
 * });
 * ```
 */
export function createRagBlock(
  transport: Transport,
  config: RagBlockConfig
): RagBlock {
  return {
    scope: createScopeService(transport, config),
    files: createRagFilesService(transport, config),
    jobs: createJobsService(transport, config),
    images: createImagesService(transport, config),
    products: createRagProductsService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
  };
}

/**
 * Block metadata
 */
export const ragBlockMetadata = {
  name: 'rag',
  version: '0.0.1',
  description: 'Vector search, document processing, image search, and product identification',
  resourceTypes: [
    'QueryResult',
    'JobStatus',
    'ImageSearchResult',
    'ProductSearchResult',
    'ProductIdentifyResult',
  ],
};
