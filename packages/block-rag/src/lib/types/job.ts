/**
 * Job status response (custom JSON, not JSON:API)
 */
export interface JobStatus {
  jobId: string;
  fileUniqueId: string;
  fileType: string;
  status: string;
  progressPercentage: number | null;
  progressMessage: string | null;
  totalPages: number | null;
  processedPages: number | null;
  totalChunks: number | null;
  totalEmbeddings: number | null;
  totalTokensUsed: number | null;
  startedAt: string | null;
  completedAt: string | null;
  processingTimeSeconds: number | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}
