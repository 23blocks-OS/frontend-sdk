import type { Transport } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { FileProcessRequest, ProcessResponse } from '../types/index.js';
import { processResponseMapper } from '../mappers/index.js';
import type { RagBlockConfig } from '../rag.block.js';

/**
 * Files service interface — generic file processing via POST /files/{file_unique_id}/process
 */
export interface RagFilesService {
  /**
   * Process a file by its unique ID.
   * @param fileUniqueId - The unique identifier of the file to process.
   * @param data - Optional processing request with file URL, type, and context.
   * @returns A JSON:API response containing the job ID and status.
   */
  process(fileUniqueId: string, data?: FileProcessRequest): Promise<ProcessResponse>;
}

/**
 * Create the files service
 */
export function createRagFilesService(
  transport: Transport,
  _config: RagBlockConfig
): RagFilesService {
  return {
    async process(fileUniqueId: string, data?: FileProcessRequest) {
      const response = await transport.post<JsonApiDocument>(
        `/files/${fileUniqueId}/process`,
        data ? {
          file_url: data.fileUrl,
          file_type: data.fileType,
          context: data.context,
        } : undefined
      );
      return decodeOne(response, processResponseMapper);
    },
  };
}
