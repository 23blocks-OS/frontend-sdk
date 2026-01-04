import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileAccessRequest,
  CreateFileAccessRequestInput,
  ReviewFileAccessRequestInput,
  ListFileAccessRequestsParams,
} from '../types/file-access-request';
import { fileAccessRequestMapper } from '../mappers/file-access-request.mapper';

/**
 * File Access Requests Service Interface - Manage access requests to files
 */
export interface FileAccessRequestsService {
  /**
   * List all access requests
   */
  list(params?: ListFileAccessRequestsParams): Promise<PageResult<FileAccessRequest>>;

  /**
   * Get a specific access request
   */
  get(uniqueId: string): Promise<FileAccessRequest>;

  /**
   * Create a new access request
   */
  create(data: CreateFileAccessRequestInput): Promise<FileAccessRequest>;

  /**
   * Review (approve/reject) an access request
   */
  review(uniqueId: string, decision: ReviewFileAccessRequestInput): Promise<FileAccessRequest>;

  /**
   * Cancel a pending access request
   */
  cancel(uniqueId: string): Promise<void>;

  /**
   * List requests for a specific file (for file owners)
   */
  listByFile(fileUniqueId: string, params?: ListFileAccessRequestsParams): Promise<PageResult<FileAccessRequest>>;

  /**
   * List requests made by a specific user
   */
  listByRequester(requesterUniqueId: string, params?: ListFileAccessRequestsParams): Promise<PageResult<FileAccessRequest>>;

  /**
   * Get pending requests count for a file owner
   */
  getPendingCount(): Promise<number>;
}

/**
 * Create the File Access Requests service
 */
export function createFileAccessRequestsService(
  transport: Transport,
  _config: { appId: string }
): FileAccessRequestsService {
  return {
    async list(params?: ListFileAccessRequestsParams): Promise<PageResult<FileAccessRequest>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.fileUniqueId) queryParams['file_unique_id'] = params.fileUniqueId;
      if (params?.requesterUniqueId) queryParams['requester_unique_id'] = params.requesterUniqueId;
      if (params?.requestStatus) queryParams['request_status'] = params.requestStatus;
      if (params?.dateFrom) queryParams['date_from'] = params.dateFrom;
      if (params?.dateTo) queryParams['date_to'] = params.dateTo;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/file_access_requests', { params: queryParams });
      return decodePageResult(response, fileAccessRequestMapper);
    },

    async get(uniqueId: string): Promise<FileAccessRequest> {
      const response = await transport.get<unknown>(`/file_access_requests/${uniqueId}`);
      return decodeOne(response, fileAccessRequestMapper);
    },

    async create(data: CreateFileAccessRequestInput): Promise<FileAccessRequest> {
      const response = await transport.post<unknown>('/file_access_requests', {
        file_access_request: {
          file_unique_id: data.fileUniqueId,
          requested_access_level: data.requestedAccessLevel,
          message: data.message,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileAccessRequestMapper);
    },

    async review(uniqueId: string, decision: ReviewFileAccessRequestInput): Promise<FileAccessRequest> {
      const response = await transport.put<unknown>(`/file_access_requests/${uniqueId}/review`, {
        file_access_request: {
          decision: decision.decision,
          review_note: decision.reviewNote,
          grant_expires_at: decision.grantExpiresAt,
        },
      });
      return decodeOne(response, fileAccessRequestMapper);
    },

    async cancel(uniqueId: string): Promise<void> {
      await transport.put(`/file_access_requests/${uniqueId}/cancel`, {});
    },

    async listByFile(
      fileUniqueId: string,
      params?: ListFileAccessRequestsParams
    ): Promise<PageResult<FileAccessRequest>> {
      const queryParams: Record<string, string> = {
        file_unique_id: fileUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.requestStatus) queryParams['request_status'] = params.requestStatus;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/file_access_requests', { params: queryParams });
      return decodePageResult(response, fileAccessRequestMapper);
    },

    async listByRequester(
      requesterUniqueId: string,
      params?: ListFileAccessRequestsParams
    ): Promise<PageResult<FileAccessRequest>> {
      const queryParams: Record<string, string> = {
        requester_unique_id: requesterUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.requestStatus) queryParams['request_status'] = params.requestStatus;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/file_access_requests', { params: queryParams });
      return decodePageResult(response, fileAccessRequestMapper);
    },

    async getPendingCount(): Promise<number> {
      const response = await transport.get<{ count: number }>('/file_access_requests/pending_count');
      return response.count;
    },
  };
}
