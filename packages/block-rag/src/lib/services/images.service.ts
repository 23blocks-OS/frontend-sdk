import type { Transport } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  ImageUploadRequest,
  ImageUploadResponse,
  ImageSearchRequest,
} from '../types/index.js';
import { imageUploadMapper } from '../mappers/index.js';
import type { RagBlockConfig } from '../rag.block.js';

/**
 * Images service interface — image upload and unified search.
 *
 * - POST /images/upload — FormData upload, returns JSON:API (type: image_upload)
 * - POST /images/search — UnifiedSearchRequest body, returns JSON:API
 */
export interface ImagesService {
  /**
   * Upload an image for vector indexing.
   * @param data - The upload request with file, optional entity type/ID, and duplicate settings.
   * @returns JSON:API response with file ID, embedding ID, and duplicate info.
   */
  upload(data: ImageUploadRequest): Promise<ImageUploadResponse>;

  /**
   * Search images using text, image URL, or base64-encoded image.
   * @param data - The search request with unified query parameters.
   * @returns JSON:API response (raw document).
   */
  search(data: ImageSearchRequest): Promise<JsonApiDocument>;
}

/**
 * Create the images service
 */
export function createImagesService(
  transport: Transport,
  _config: RagBlockConfig
): ImagesService {
  return {
    async upload(data: ImageUploadRequest) {
      const formData = new FormData();
      formData.append('file', data.file);
      if (data.entityType) {
        formData.append('entity_type', data.entityType);
      }
      if (data.entityId) {
        formData.append('entity_id', data.entityId);
      }
      if (data.checkDuplicates !== undefined) {
        formData.append('check_duplicates', String(data.checkDuplicates));
      }
      if (data.duplicateThreshold !== undefined) {
        formData.append('duplicate_threshold', String(data.duplicateThreshold));
      }

      const response = await transport.post<JsonApiDocument>('/images/upload', formData);
      return decodeOne(response, imageUploadMapper);
    },

    async search(data: ImageSearchRequest) {
      const q = data.query;
      return transport.post<JsonApiDocument>('/images/search', {
        query: {
          image_url: q.imageUrl,
          image_base64: q.imageBase64,
          text: q.text,
          limit: q.limit,
          similarity_threshold: q.similarityThreshold,
          text_weight: q.textWeight,
          image_weight: q.imageWeight,
          filters: q.filters,
        },
      });
    },
  };
}
