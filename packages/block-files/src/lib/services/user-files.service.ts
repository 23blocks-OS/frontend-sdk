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
  MultipartCompleteResponse,
  UserFileAccessGrant,
  UserFileAccessInput,
  UserFileDelegationGrant,
  CreateDelegationRequest,
  UserFileAccessRequestInput,
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
   * @param data - Fields to update
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
   * @param data - Upload metadata including file name and serialization
   * @returns Presigned upload URL, file key, optional form fields, and expiration
   */
  presignUpload(userUniqueId: string, data: PresignUploadRequest): Promise<PresignUploadResponse>;

  /**
   * Get presigned URLs for multipart file upload
   * @param userUniqueId - The unique identifier of the user
   * @param data - Upload metadata including file name, part count, and serialization
   * @returns Upload ID, file key, and array of part-level presigned URLs
   */
  multipartPresign(userUniqueId: string, data: MultipartPresignRequest): Promise<MultipartPresignResponse>;

  /**
   * Complete a multipart upload after all parts have been uploaded
   * @param userUniqueId - The unique identifier of the user
   * @param data - Completion data including file name, upload ID, and part ETags
   * @returns Confirmation with public URL, file id, and expiration
   */
  multipartComplete(userUniqueId: string, data: MultipartCompleteRequest): Promise<MultipartCompleteResponse>;

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
   * @param tagValue - The tag string to add
   * @returns The updated UserFile record with the tag applied
   */
  addTag(userUniqueId: string, fileUniqueId: string, tagValue: string): Promise<UserFile>;

  /**
   * Remove a tag from a user file
   * @param userUniqueId - The unique identifier of the user
   * @param fileUniqueId - The unique identifier of the file
   * @param tagUniqueId - The unique identifier of the tag to remove
   * @returns Resolves when the tag has been removed
   */
  removeTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void>;

  /**
   * Bulk update tags for a user file
   * @param userUniqueId - The unique identifier of the user
   * @param tags - Array of tag strings to set
   * @returns Resolves when tags have been updated
   */
  bulkUpdateTags(userUniqueId: string, tags: string[]): Promise<void>;

  // ---- Access control ----

  /**
   * Request access to a file
   * @param userUniqueId - The unique identifier of the requesting user
   * @param fileUniqueId - The unique identifier of the file
   * @param data - Access request details
   * @returns Resolves when the access request has been submitted
   */
  requestAccess(userUniqueId: string, fileUniqueId: string, data: UserFileAccessRequestInput): Promise<void>;

  /**
   * Get all access grants for a file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @returns Array of FileAccess records for the given file
   */
  getAccess(userUniqueId: string, fileUniqueId: string): Promise<UserFileAccessGrant[]>;

  /**
   * Grant access to a file for a specific user
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @param data - Access details including user, access type, and optional expiry
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
   * @param data - Delegation details including grantee, access type, and optional expiry
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
          name: data.name,
          file_type: data.fileType,
          file_size: data.fileSize,
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          media_url: data.mediaUrl,
          content_url: data.contentUrl,
          image_url: data.imageUrl,
          description: data.description,
          original_name: data.originalName,
          original_file: data.originalFile,
          virtual_folder: data.virtualFolder,
          category_name: data.categoryName,
          category_unique_id: data.categoryUniqueId,
          tags: data.tags,
          is_public: data.isPublic,
          access_level: data.accessLevel,
          ai_enabled: data.aiEnabled,
          is_temp: data.isTemp,
          raw_content: data.rawContent,
          content: data.content,
          file_structure: data.fileStructure,
          metadata: data.metadata,
          structured_content: data.structuredContent,
          schema_model: data.schemaModel,
          is_expirable: data.isExpirable,
          issued_at: data.issuedAt,
          expires_at: data.expiresAt,
          issued_by: data.issuedBy,
        },
      });
      return decodeOne(response, userFileMapper);
    },

    async update(userUniqueId: string, fileUniqueId: string, data: UpdateUserFileRequest): Promise<UserFile> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}`, {
        file: {
          name: data.name,
          file_type: data.fileType,
          file_size: data.fileSize,
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          media_url: data.mediaUrl,
          content_url: data.contentUrl,
          image_url: data.imageUrl,
          description: data.description,
          original_name: data.originalName,
          original_file: data.originalFile,
          virtual_folder: data.virtualFolder,
          category_name: data.categoryName,
          category_unique_id: data.categoryUniqueId,
          tags: data.tags,
          is_public: data.isPublic,
          access_level: data.accessLevel,
          ai_enabled: data.aiEnabled,
          is_temp: data.isTemp,
          raw_content: data.rawContent,
          content: data.content,
          file_structure: data.fileStructure,
          metadata: data.metadata,
          structured_content: data.structuredContent,
          schema_model: data.schemaModel,
          is_expirable: data.isExpirable,
          issued_at: data.issuedAt,
          expires_at: data.expiresAt,
          issued_by: data.issuedBy,
        },
      });
      return decodeOne(response, userFileMapper);
    },

    async delete(userUniqueId: string, fileUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}`);
    },

    async presignUpload(userUniqueId: string, data: PresignUploadRequest): Promise<PresignUploadResponse> {
      const response = await transport.put<{
        data: {
          attributes: {
            presigned_url: string;
            signed_url: string;
            public_url: string;
            file_name: string;
            file_id: string;
            expires_at: string;
          };
        };
      }>(`/users/${userUniqueId}/presign_upload`, undefined, {
        params: {
          filename: data.fileName,
          serialization: 'jsonapi',
        },
      });
      const attrs = response.data.attributes;
      return {
        presignedUrl: attrs.presigned_url,
        signedUrl: attrs.signed_url,
        publicUrl: attrs.public_url,
        fileName: attrs.file_name,
        fileId: attrs.file_id,
        expiresAt: new Date(attrs.expires_at),
      };
    },

    async multipartPresign(userUniqueId: string, data: MultipartPresignRequest): Promise<MultipartPresignResponse> {
      const response = await transport.post<{
        data: {
          attributes: {
            upload_id: string;
            presigned_urls: string[];
            file_id: string;
            expires_at: string;
          };
        };
      }>(`/users/${userUniqueId}/multipart_presign_upload`, {
        filename: data.fileName,
        part_count: data.partCount,
        serialization: 'jsonapi',
      });
      const attrs = response.data.attributes;
      return {
        uploadId: attrs.upload_id,
        fileId: attrs.file_id,
        parts: attrs.presigned_urls.map((url, idx) => ({
          partNumber: idx + 1,
          presignedUrl: url,
        })),
        expiresAt: new Date(attrs.expires_at),
      };
    },

    async multipartComplete(userUniqueId: string, data: MultipartCompleteRequest): Promise<MultipartCompleteResponse> {
      const response = await transport.post<{
        data: {
          attributes: {
            public_url: string;
            file_name: string;
            file_id: string;
            expires_at: string;
          };
        };
      }>(`/users/${userUniqueId}/multipart_complete_upload`, {
        filename: data.fileName,
        upload_id: data.uploadId,
        parts: data.parts.map((p) => ({
          ETag: p.etag,
          PartNumber: p.partNumber,
        })),
        serialization: 'jsonapi',
      });
      const attrs = response.data.attributes;
      return {
        publicUrl: attrs.public_url,
        fileName: attrs.file_name,
        fileId: attrs.file_id,
        expiresAt: new Date(attrs.expires_at),
      };
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

    async addTag(userUniqueId: string, fileUniqueId: string, tagValue: string): Promise<UserFile> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/files/${fileUniqueId}/tags`, {
        tag: { tag: tagValue },
      });
      return decodeOne(response, userFileMapper);
    },

    async removeTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}/tags/${tagUniqueId}`);
    },

    async bulkUpdateTags(userUniqueId: string, tags: string[]): Promise<void> {
      await transport.post(`/users/${userUniqueId}/tags`, {
        file: { tags },
      });
    },

    async requestAccess(userUniqueId: string, fileUniqueId: string, data: UserFileAccessRequestInput): Promise<void> {
      await transport.post(`/users/${userUniqueId}/files/${fileUniqueId}/requests/access`, {
        access: {
          user_unique_id: data.userUniqueId,
          access_type: data.accessType,
          starts_at: data.startsAt,
          expires_at: data.expiresAt,
        },
      });
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
          user_unique_id: data.userUniqueId,
          access_type: data.accessType,
          expires_at: data.expiresAt,
          starts_at: data.startsAt,
          user_unique_ids: data.userUniqueIds,
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
        accessType: String(item['access_type'] ?? ''),
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
        accessType: String(item['access_type'] ?? ''),
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
        accessType: String(response['access_type'] ?? ''),
        createdAt: new Date(response['created_at'] as string),
        expiresAt: response['expires_at'] ? new Date(response['expires_at'] as string) : undefined,
      };
    },

    async createDelegation(userUniqueId: string, data: CreateDelegationRequest): Promise<UserFileDelegationGrant> {
      const response = await transport.post<Record<string, unknown>>(`/users/${userUniqueId}/delegations`, {
        access: {
          grantee_user_unique_id: data.granteeUserUniqueId,
          access_type: data.accessType,
          expires_at: data.expiresAt,
          starts_at: data.startsAt,
        },
      });
      return {
        uniqueId: String(response['unique_id'] ?? ''),
        granterUniqueId: String(response['granter_unique_id'] ?? ''),
        granteeUniqueId: String(response['grantee_unique_id'] ?? ''),
        accessType: String(response['access_type'] ?? ''),
        createdAt: new Date(response['created_at'] as string),
        expiresAt: response['expires_at'] ? new Date(response['expires_at'] as string) : undefined,
      };
    },

    async revokeDelegation(userUniqueId: string, delegationUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/delegations/${delegationUniqueId}`);
    },
  };
}
