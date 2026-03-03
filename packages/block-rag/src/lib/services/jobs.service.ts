import type { Transport } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { JobStatus } from '../types/index.js';
import { jobStatusMapper } from '../mappers/index.js';
import type { RagBlockConfig } from '../rag.block.js';

/**
 * Jobs service interface — job status tracking via GET /jobs/{job_id}
 * Returns JSON:API (type: "job").
 */
export interface JobsService {
  /**
   * Get the status of a processing job.
   * @param jobId - The unique identifier of the job.
   * @returns The current job status including progress, pages, chunks, and timing.
   */
  get(jobId: string): Promise<JobStatus>;
}

/**
 * Create the jobs service
 */
export function createJobsService(
  transport: Transport,
  _config: RagBlockConfig
): JobsService {
  return {
    async get(jobId: string) {
      const response = await transport.get<JsonApiDocument>(`/jobs/${jobId}`);
      return decodeOne(response, jobStatusMapper);
    },
  };
}
