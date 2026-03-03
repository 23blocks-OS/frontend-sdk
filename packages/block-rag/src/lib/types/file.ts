/**
 * Request to process a file by its unique ID.
 * Body fields for POST /files/{file_unique_id}/process
 */
export interface FileProcessRequest {
  fileUrl?: string;
  fileType?: string;
  context?: Record<string, unknown>;
}
