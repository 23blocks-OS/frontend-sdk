import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileAccessRequest,
  CreateFileAccessRequestInput,
  ReviewFileAccessRequestInput,
  ListFileAccessRequestsParams,
} from '../types/file-access-request.js';
import { fileAccessRequestMapper } from '../mappers/file-access-request.mapper.js';

/**
 * File Access Requests Service Interface - Manage access requests to files
 */
export interface FileAccessRequestsService {
  /**
   * List all access requests
   * @param params - Optional filtering by file, requester, status, date range, and pagination
   * @returns Paginated result containing FileAccessRequest items and metadata
   */
  list(params?: ListFileAccessRequestsParams): Promise<PageResult<FileAccessRequest>>;

  /**
   * Get a specific access request
   * @param uniqueId - The unique identifier of the access request
   * @returns The matching FileAccessRequest record
   */
  get(uniqueId: string): Promise<FileAccessRequest>;

  /**
   * Create a new access request
   * @param data - Request details including user, access type, and optional date range
   * @returns The newly created FileAccessRequest record
   */
  create(data: CreateFileAccessRequestInput): Promise<FileAccessRequest>;

  /**
   * Review (approve/reject) an access request
   * @param uniqueId - The unique identifier of the access request to review
   * @param decision - The review decision with optional expiration
   * @returns The updated FileAccessRequest record reflecting the review outcome
   */
  review(uniqueId: string, decision: ReviewFileAccessRequestInput): Promise<FileAccessRequest>;

  /**
   * Cancel a pending access request
   * @param uniqueId - The unique identifier of the access request to cancel
   * @returns Resolves when the request has been cancelled
   * @note Uses PUT instead of DELETE to transition request status
   */
  cancel(uniqueId: string): Promise<void>;

  /**
   * List requests for a specific file (for file owners)
   * @param fileUniqueId - The unique identifier of the file
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated result of FileAccessRequest records for the given file
   */
  listByFile(fileUniqueId: string, params?: ListFileAccessRequestsParams): Promise<PageResult<FileAccessRequest>>;

  /**
   * List requests made by a specific user
   * @param requesterUniqueId - The unique identifier of the requester
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated result of FileAccessRequest records by the given requester
   */
  listByRequester(requesterUniqueId: string, params?: ListFileAccessRequestsParams): Promise<PageResult<FileAccessRequest>>;

  /**
   * Get pending requests count for a file owner
   * @returns The number of pending access requests
   */
  getPendingCount(): Promise<number>;
}

/**
 * Create the File Access Requests service
 */
export function createFileAccessRequestsService(
  transport: Transport,
  _config: { apiKey: string }
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
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/file_access_requests/${uniqueId}`);
      return decodeOne(response, fileAccessRequestMapper);
    },

    async create(data: CreateFileAccessRequestInput): Promise<FileAccessRequest> {
      const response = await transport.post<unknown>('/file_access_requests', {
        access: {
          user_unique_id: data.userUniqueId,
          access_type: data.accessType,
          starts_at: data.startsAt,
          expires_at: data.expiresAt,
        },
      });
      return decodeOne(response, fileAccessRequestMapper);
    },

    async review(uniqueId: string, decision: ReviewFileAccessRequestInput): Promise<FileAccessRequest> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/file_access_requests/${uniqueId}/review`, {
        access: {
          expires_at: decision.expiresAt,
        },
      });
      return decodeOne(response, fileAccessRequestMapper);
    },

    async cancel(uniqueId: string): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
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
