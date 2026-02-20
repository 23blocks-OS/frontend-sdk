import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  UserFile,
  ListUserFilesParams,
  AddUserFileRequest,
  UpdateUserFileRequest,
  PresignUploadRequest,
  PresignUploadResponse,
  MultipartPresignRequest,
  MultipartPresignResponse,
  MultipartCompleteRequest,
  UserFileAccessGrant,
  UserFileAccessInput,
  UserFileDelegationGrant,
  CreateDelegationRequest,
} from '../types/user-file.js';
import { userFileMapper } from '../mappers/user-file.mapper.js';

export interface UserFilesService {
  // ---- File CRUD ----

  /**
   * List all files for a user
   * @param userUniqueId - The unique identifier of the user
   * @param params - Optional filtering by status, file type, schema, and pagination
   * @returns Paginated result containing UserFile items and metadata
   */
  list(userUniqueId: string, params?: ListUserFilesParams): Promise<PageResult<UserFile>>;

  /**
   * Get a specific user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file
   * @returns The matching UserFile record
   */
  get(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  /**
   * Add a new file record to a user
   * @param userUniqueId - The unique identifier of the user
   * @param data - File details including name, type, size, and URL
   * @returns The newly created UserFile record
   */
  add(userUniqueId: string, data: AddUserFileRequest): Promise<UserFile>;

  /**
   * Update a user file record
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file to update
   * @param data - Fields to update such as file name, type, or thumbnail
   * @returns The updated UserFile record
   */
  update(userUniqueId: string, fileUniqueId: string, data: UpdateUserFileRequest): Promise<UserFile>;

  /**
   * Delete a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file to delete
   * @returns Resolves when the file has been deleted
   */
  delete(userUniqueId: string, fileUniqueId: string): Promise<void>;

  // ---- Upload ----

  /**
   * Get a presigned URL for single-part file upload
   * @param userUniqueId - The unique identifier of the user
   * @param data - Upload metadata including file name, type, and MIME type
   * @returns Presigned upload URL, file key, optional form fields, and expiration
   */
  presignUpload(userUniqueId: string, data: PresignUploadRequest): Promise<PresignUploadResponse>;

  /**
   * Get presigned URLs for multipart file upload
   * @param userUniqueId - The unique identifier of the user
   * @param data - Upload metadata including file name, size, and part size
   * @returns Upload ID, file key, and array of part-level presigned URLs
   * @note Use this for large files that need to be uploaded in chunks
   */
  multipartPresign(userUniqueId: string, data: MultipartPresignRequest): Promise<MultipartPresignResponse>;

  /**
   * Complete a multipart upload after all parts have been uploaded
   * @param userUniqueId - The unique identifier of the user
   * @param data - Completion data including upload ID, file key, and part ETags
   * @returns The finalized UserFile record
   */
  multipartComplete(userUniqueId: string, data: MultipartCompleteRequest): Promise<UserFile>;

  // ---- File status ----

  /**
   * Approve a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file to approve
   * @returns The updated UserFile record with approved status
   */
  approve(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  /**
   * Reject a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file to reject
   * @returns The updated UserFile record with rejected status
   */
  reject(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  /**
   * Publish a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file to publish
   * @returns The updated UserFile record with published status
   */
  publish(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  /**
   * Unpublish a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file to unpublish
   * @returns The updated UserFile record with unpublished status
   */
  unpublish(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  // ---- Tags ----

  /**
   * Add a tag to a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file
   * @param tagUniqueId - The unique identifier of the tag to add
   * @returns The updated UserFile record with the tag applied
   */
  addTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<UserFile>;

  /**
   * Remove a tag from a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file
   * @param tagUniqueId - The unique identifier of the tag to remove
   * @returns Resolves when the tag has been removed
   */
  removeTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void>;

  /**
   * Bulk update tags for a user
   * @param userUniqueId - The unique identifier of the user
   * @param tagUniqueIds - Array of tag unique identifiers to set
   * @returns Resolves when tags have been updated
   */
  bulkUpdateTags(userUniqueId: string, tagUniqueIds: string[]): Promise<void>;

  // ---- Access control ----

  /**
   * Request access to a file
   * @param userUniqueId - The unique identifier of the requesting user
   * @param fileUniqueId - The unique identifier of the file
   * @returns Resolves when the access request has been submitted
   */
  requestAccess(userUniqueId: string, fileUniqueId: string): Promise<void>;

  /**
   * Get all access grants for a file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @returns Array of FileAccess records for the given file
   */
  getAccess(userUniqueId: string, fileUniqueId: string): Promise<UserFileAccessGrant[]>;

  /**
   * Grant access to a file for a specific grantee
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @param data - Access details including grantee, access type, and optional expiry
   * @returns The newly created FileAccess record
   */
  grantAccess(userUniqueId: string, fileUniqueId: string, data: UserFileAccessInput): Promise<UserFileAccessGrant>;

  /**
   * Revoke a specific access grant on a file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @param accessUniqueId - The unique identifier of the access grant to revoke
   * @returns Resolves when the access grant has been revoked
   */
  revokeAccess(userUniqueId: string, fileUniqueId: string, accessUniqueId: string): Promise<void>;

  /**
   * Make a file publicly accessible
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @returns The updated UserFile record with public access
   */
  makePublic(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  /**
   * Make a file private (remove public access)
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @returns The updated UserFile record with private access
   */
  makePrivate(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  // ---- Bulk access operations ----

  /**
   * Grant access to multiple files for multiple grantees in one operation
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueIds - Array of file unique identifiers
   * @param granteeUniqueIds - Array of grantee unique identifiers
   * @returns Resolves when all access grants have been created
   */
  bulkGrantAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Promise<void>;

  /**
   * Revoke access to multiple files for multiple grantees in one operation
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueIds - Array of file unique identifiers
   * @param granteeUniqueIds - Array of grantee unique identifiers
   * @returns Resolves when all access grants have been revoked
   */
  bulkRevokeAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Promise<void>;

  // ---- Access requests management ----

  /**
   * List pending access requests for a file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @returns Array of FileAccess records representing pending requests
   */
  listAccessRequests(userUniqueId: string, fileUniqueId: string): Promise<UserFileAccessGrant[]>;

  /**
   * Approve an access request for a file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @param requestUniqueId - The unique identifier of the request to approve
   * @returns The resulting FileAccess record after approval
   */
  approveAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Promise<UserFileAccessGrant>;

  /**
   * Deny an access request for a file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @param requestUniqueId - The unique identifier of the request to deny
   * @returns Resolves when the request has been denied
   */
  denyAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Promise<void>;

  // ---- Delegations ----

  /**
   * List delegations granted by a user to others
   * @param userUniqueId - The unique identifier of the granting user
   * @returns Array of FileDelegation records granted by this user
   */
  listGrantedDelegations(userUniqueId: string): Promise<UserFileDelegationGrant[]>;

  /**
   * List delegations received by a user from others
   * @param userUniqueId - The unique identifier of the receiving user
   * @returns Array of FileDelegation records received by this user
   */
  listReceivedDelegations(userUniqueId: string): Promise<UserFileDelegationGrant[]>;

  /**
   * Get a specific delegation
   * @param userUniqueId - The unique identifier of the user
   * @param delegationUniqueId - The unique identifier of the delegation
   * @returns The matching FileDelegation record
   */
  getDelegation(userUniqueId: string, delegationUniqueId: string): Promise<UserFileDelegationGrant>;

  /**
   * Create a new delegation to another user
   * @param userUniqueId - The unique identifier of the granting user
   * @param data - Delegation details including grantee, access level, and optional expiry
   * @returns The newly created FileDelegation record
   */
  createDelegation(userUniqueId: string, data: CreateDelegationRequest): Promise<UserFileDelegationGrant>;

  /**
   * Revoke a delegation
   * @param userUniqueId - The unique identifier of the granting user
   * @param delegationUniqueId - The unique identifier of the delegation to revoke
   * @returns Resolves when the delegation has been revoked
   */
  revokeDelegation(userUniqueId: string, delegationUniqueId: string): Promise<void>;
}

export function createUserFilesService(transport: Transport, _config: { apiKey: string }): UserFilesService {
  return {
    async list(userUniqueId: string, params?: ListUserFilesParams): Promise<PageResult<UserFile>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.fileType) queryParams['file_type'] = params.fileType;
      if (params?.schemaUniqueId) queryParams['schema_unique_id'] = params.schemaUniqueId;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/files`, { params: queryParams });
      return decodePageResult(response, userFileMapper);
    },

    async get(userUniqueId: string, fileUniqueId: string): Promise<UserFile> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}`);
      return decodeOne(response, userFileMapper);
    },

    async add(userUniqueId: string, data: AddUserFileRequest): Promise<UserFile> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/files`, {
        file: {
          file_name: data.fileName,
          file_type: data.fileType,
          file_size: data.fileSize,
          mime_type: data.mimeType,
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          schema_unique_id: data.schemaUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, userFileMapper);
    },

    async update(userUniqueId: string, fileUniqueId: string, data: UpdateUserFileRequest): Promise<UserFile> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}`, {
        file: {
          file_name: data.fileName,
          file_type: data.fileType,
          thumbnail_url: data.thumbnailUrl,
          schema_unique_id: data.schemaUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, userFileMapper);
    },

    async delete(userUniqueId: string, fileUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}`);
    },

    async presignUpload(userUniqueId: string, data: PresignUploadRequest): Promise<PresignUploadResponse> {
      const response = await transport.put<{
        presigned_url: string;
        file_key: string;
        fields?: Record<string, string>;
        expires_at: string;
      }>(`/users/${userUniqueId}/presign_upload`, {
        file: {
          file_name: data.fileName,
          file_type: data.fileType,
          mime_type: data.mimeType,
          schema_unique_id: data.schemaUniqueId,
        },
      });
      return {
        presignedUrl: response.presigned_url,
        fileKey: response.file_key,
        fields: response.fields,
        expiresAt: new Date(response.expires_at),
      };
    },

    async multipartPresign(userUniqueId: string, data: MultipartPresignRequest): Promise<MultipartPresignResponse> {
      const response = await transport.post<{
        upload_id: string;
        file_key: string;
        parts: Array<{ part_number: number; presigned_url: string }>;
      }>(`/users/${userUniqueId}/multipart_presign_upload`, {
        file: {
          file_name: data.fileName,
          file_type: data.fileType,
          file_size: data.fileSize,
          mime_type: data.mimeType,
          part_size: data.partSize,
        },
      });
      return {
        uploadId: response.upload_id,
        fileKey: response.file_key,
        parts: response.parts.map((p) => ({
          partNumber: p.part_number,
          presignedUrl: p.presigned_url,
        })),
      };
    },

    async multipartComplete(userUniqueId: string, data: MultipartCompleteRequest): Promise<UserFile> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/multipart_complete_upload`, {
        upload: {
          upload_id: data.uploadId,
          file_key: data.fileKey,
          parts: data.parts.map((p) => ({
            part_number: p.partNumber,
            etag: p.etag,
          })),
        },
      });
      return decodeOne(response, userFileMapper);
    },

    async approve(userUniqueId: string, fileUniqueId: string): Promise<UserFile> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/approve`, {});
      return decodeOne(response, userFileMapper);
    },

    async reject(userUniqueId: string, fileUniqueId: string): Promise<UserFile> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/reject`, {});
      return decodeOne(response, userFileMapper);
    },

    async publish(userUniqueId: string, fileUniqueId: string): Promise<UserFile> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/publish`, {});
      return decodeOne(response, userFileMapper);
    },

    async unpublish(userUniqueId: string, fileUniqueId: string): Promise<UserFile> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/unpublish`, {});
      return decodeOne(response, userFileMapper);
    },

    async addTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<UserFile> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/tags`, {
        tag: { unique_id: tagUniqueId },
      });
      return decodeOne(response, userFileMapper);
    },

    async removeTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}/tags/${tagUniqueId}`);
    },

    async bulkUpdateTags(userUniqueId: string, tagUniqueIds: string[]): Promise<void> {
      await transport.post(`/users/${userUniqueId}/tags`, {
        tags: { unique_ids: tagUniqueIds },
      });
    },

    async requestAccess(userUniqueId: string, fileUniqueId: string): Promise<void> {
      await transport.post(`/users/${userUniqueId}/files/${fileUniqueId}/requests/access`, {});
    },

    async getAccess(userUniqueId: string, fileUniqueId: string): Promise<UserFileAccessGrant[]> {
      const response = await transport.get<{ data: Array<Record<string, unknown>> }>(`/users/${userUniqueId}/files/${fileUniqueId}/access`);
      return (response.data || []).map((item) => ({
        uniqueId: String(item['unique_id'] ?? ''),
        fileUniqueId: String(item['file_unique_id'] ?? ''),
        granteeUniqueId: String(item['grantee_unique_id'] ?? ''),
        accessType: String(item['access_type'] ?? ''),
        grantedAt: new Date(item['granted_at'] as string),
        expiresAt: item['expires_at'] ? new Date(item['expires_at'] as string) : undefined,
      }));
    },

    async grantAccess(userUniqueId: string, fileUniqueId: string, data: UserFileAccessInput): Promise<UserFileAccessGrant> {
      const response = await transport.post<Record<string, unknown>>(`/users/${userUniqueId}/files/${fileUniqueId}/access/grant`, {
        access: {
          grantee_unique_id: data.granteeUniqueId,
          access_type: data.accessType,
          expires_at: data.expiresAt,
        },
      });
      return {
        uniqueId: String(response['unique_id'] ?? ''),
        fileUniqueId: String(response['file_unique_id'] ?? ''),
        granteeUniqueId: String(response['grantee_unique_id'] ?? ''),
        accessType: String(response['access_type'] ?? ''),
        grantedAt: new Date(response['granted_at'] as string),
        expiresAt: response['expires_at'] ? new Date(response['expires_at'] as string) : undefined,
      };
    },

    async revokeAccess(userUniqueId: string, fileUniqueId: string, accessUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}/access/${accessUniqueId}/revoke`);
    },

    async makePublic(userUniqueId: string, fileUniqueId: string): Promise<UserFile> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/access/make_public`, {});
      return decodeOne(response, userFileMapper);
    },

    async makePrivate(userUniqueId: string, fileUniqueId: string): Promise<UserFile> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/access/make_private`, {});
      return decodeOne(response, userFileMapper);
    },

    async bulkGrantAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Promise<void> {
      await transport.post(`/users/${userUniqueId}/files/access/grant`, {
        access: {
          file_unique_ids: fileUniqueIds,
          grantee_unique_ids: granteeUniqueIds,
        },
      });
    },

    async bulkRevokeAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Promise<void> {
      await transport.post(`/users/${userUniqueId}/files/access/revoke`, {
        access: {
          file_unique_ids: fileUniqueIds,
          grantee_unique_ids: granteeUniqueIds,
        },
      });
    },

    async listAccessRequests(userUniqueId: string, fileUniqueId: string): Promise<UserFileAccessGrant[]> {
      const response = await transport.get<{ data: Array<Record<string, unknown>> }>(`/users/${userUniqueId}/files/${fileUniqueId}/access/requests`);
      return (response.data || []).map((item) => ({
        uniqueId: String(item['unique_id'] ?? ''),
        fileUniqueId: String(item['file_unique_id'] ?? ''),
        granteeUniqueId: String(item['grantee_unique_id'] ?? ''),
        accessType: String(item['access_type'] ?? ''),
        grantedAt: new Date(item['granted_at'] as string),
        expiresAt: item['expires_at'] ? new Date(item['expires_at'] as string) : undefined,
      }));
    },

    async approveAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Promise<UserFileAccessGrant> {
      const response = await transport.put<Record<string, unknown>>(`/users/${userUniqueId}/files/${fileUniqueId}/access/requests/${requestUniqueId}/approve`, {});
      return {
        uniqueId: String(response['unique_id'] ?? ''),
        fileUniqueId: String(response['file_unique_id'] ?? ''),
        granteeUniqueId: String(response['grantee_unique_id'] ?? ''),
        accessType: String(response['access_type'] ?? ''),
        grantedAt: new Date(response['granted_at'] as string),
        expiresAt: response['expires_at'] ? new Date(response['expires_at'] as string) : undefined,
      };
    },

    async denyAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}/access/requests/${requestUniqueId}/deny`);
    },

    async listGrantedDelegations(userUniqueId: string): Promise<UserFileDelegationGrant[]> {
      const response = await transport.get<{ data: Array<Record<string, unknown>> }>(`/users/${userUniqueId}/delegations/granted`);
      return (response.data || []).map((item) => ({
        uniqueId: String(item['unique_id'] ?? ''),
        granterUniqueId: String(item['granter_unique_id'] ?? ''),
        granteeUniqueId: String(item['grantee_unique_id'] ?? ''),
        accessLevel: String(item['access_level'] ?? ''),
        createdAt: new Date(item['created_at'] as string),
        expiresAt: item['expires_at'] ? new Date(item['expires_at'] as string) : undefined,
      }));
    },

    async listReceivedDelegations(userUniqueId: string): Promise<UserFileDelegationGrant[]> {
      const response = await transport.get<{ data: Array<Record<string, unknown>> }>(`/users/${userUniqueId}/delegations/received`);
      return (response.data || []).map((item) => ({
        uniqueId: String(item['unique_id'] ?? ''),
        granterUniqueId: String(item['granter_unique_id'] ?? ''),
        granteeUniqueId: String(item['grantee_unique_id'] ?? ''),
        accessLevel: String(item['access_level'] ?? ''),
        createdAt: new Date(item['created_at'] as string),
        expiresAt: item['expires_at'] ? new Date(item['expires_at'] as string) : undefined,
      }));
    },

    async getDelegation(userUniqueId: string, delegationUniqueId: string): Promise<UserFileDelegationGrant> {
      const response = await transport.get<Record<string, unknown>>(`/users/${userUniqueId}/delegations/${delegationUniqueId}`);
      return {
        uniqueId: String(response['unique_id'] ?? ''),
        granterUniqueId: String(response['granter_unique_id'] ?? ''),
        granteeUniqueId: String(response['grantee_unique_id'] ?? ''),
        accessLevel: String(response['access_level'] ?? ''),
        createdAt: new Date(response['created_at'] as string),
        expiresAt: response['expires_at'] ? new Date(response['expires_at'] as string) : undefined,
      };
    },

    async createDelegation(userUniqueId: string, data: CreateDelegationRequest): Promise<UserFileDelegationGrant> {
      const response = await transport.post<Record<string, unknown>>(`/users/${userUniqueId}/delegations`, {
        delegation: {
          grantee_unique_id: data.granteeUniqueId,
          access_level: data.accessLevel,
          expires_at: data.expiresAt,
        },
      });
      return {
        uniqueId: String(response['unique_id'] ?? ''),
        granterUniqueId: String(response['granter_unique_id'] ?? ''),
        granteeUniqueId: String(response['grantee_unique_id'] ?? ''),
        accessLevel: String(response['access_level'] ?? ''),
        createdAt: new Date(response['created_at'] as string),
        expiresAt: response['expires_at'] ? new Date(response['expires_at'] as string) : undefined,
      };
    },

    async revokeDelegation(userUniqueId: string, delegationUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/delegations/${delegationUniqueId}`);
    },
  };
}
