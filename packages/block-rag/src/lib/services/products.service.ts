import type { Transport } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  ProductIdentifyRequest,
  ProductIdentifyResponse,
  ProductSearchRequest,
} from '../types/index.js';
import { productIdentifyMapper, parseNumber } from '../mappers/index.js';
import type { RagBlockConfig } from '../rag.block.js';

/**
 * Products service interface — product identification and unified search.
 *
 * - POST /products/identify — FormData upload, returns JSON:API (type: product_identify, meta.query_time_ms)
 * - POST /products/search — UnifiedSearchRequest body, returns JSON:API
 */
export interface RagProductsService {
  /**
   * Identify a product from an uploaded image.
   * @param data - The identification request with file, confidence threshold, and category hint.
   * @returns JSON:API response with product match and confidence.
   */
  identify(data: ProductIdentifyRequest): Promise<ProductIdentifyResponse>;

  /**
   * Search products using text, image URL, or base64-encoded image.
   * @param data - The search request with unified query parameters.
   * @returns JSON:API response (raw document).
   */
  search(data: ProductSearchRequest): Promise<JsonApiDocument>;
}

/**
 * Create the products service
 */
export function createRagProductsService(
  transport: Transport,
  _config: RagBlockConfig
): RagProductsService {
  return {
    async identify(data: ProductIdentifyRequest) {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.confidenceThreshold !== undefined) {
        formData.append('confidence_threshold', String(data.confidenceThreshold));
      }
      if (data.categoryHint) {
        formData.append('category_hint', data.categoryHint);
      }

      const response = await transport.post<JsonApiDocument & { meta?: { query_time_ms?: number } }>(
        '/products/identify',
        formData
      );
      const decoded = decodeOne(response, productIdentifyMapper);
      return {
        ...decoded,
        queryTimeMs: parseNumber(response.meta?.query_time_ms),
      };
    },

    async search(data: ProductSearchRequest) {
      const q = data.query;
      const queryBody: Record<string, unknown> = {
        image_url: q.imageUrl,
        image_base64: q.imageBase64,
        text: q.text,
        limit: q.limit,
        similarity_threshold: q.similarityThreshold,
        text_weight: q.textWeight,
        image_weight: q.imageWeight,
        filters: q.filters,
      };
      if (q.useObjectDetection !== undefined) {
        queryBody['use_object_detection'] = q.useObjectDetection;
      }
      return transport.post<JsonApiDocument>('/products/search', { query: queryBody });
    },
  };
}
