import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
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
  FileAccess,
  FileAccessRequest,
  FileDelegation,
  CreateDelegationRequest,
} from '../types/user-file';
import { userFileMapper } from '../mappers/user-file.mapper';

export interface UserFilesService {
  // File CRUD
  list(userUniqueId: string, params?: ListUserFilesParams): Promise<PageResult<UserFile>>;
  get(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;
  add(userUniqueId: string, data: AddUserFileRequest): Promise<UserFile>;
  update(userUniqueId: string, fileUniqueId: string, data: UpdateUserFileRequest): Promise<UserFile>;
  delete(userUniqueId: string, fileUniqueId: string): Promise<void>;

  // Upload
  presignUpload(userUniqueId: string, data: PresignUploadRequest): Promise<PresignUploadResponse>;
  multipartPresign(userUniqueId: string, data: MultipartPresignRequest): Promise<MultipartPresignResponse>;
  multipartComplete(userUniqueId: string, data: MultipartCompleteRequest): Promise<UserFile>;

  // File status
  approve(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;
  reject(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;
  publish(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;
  unpublish(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  // Tags
  addTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<UserFile>;
  removeTag(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void>;
  bulkUpdateTags(userUniqueId: string, tagUniqueIds: string[]): Promise<void>;

  // Access control
  requestAccess(userUniqueId: string, fileUniqueId: string): Promise<void>;
  getAccess(userUniqueId: string, fileUniqueId: string): Promise<FileAccess[]>;
  grantAccess(userUniqueId: string, fileUniqueId: string, data: FileAccessRequest): Promise<FileAccess>;
  revokeAccess(userUniqueId: string, fileUniqueId: string, accessUniqueId: string): Promise<void>;
  makePublic(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;
  makePrivate(userUniqueId: string, fileUniqueId: string): Promise<UserFile>;

  // Bulk access operations
  bulkGrantAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Promise<void>;
  bulkRevokeAccess(userUniqueId: string, fileUniqueIds: string[], granteeUniqueIds: string[]): Promise<void>;

  // Access requests management
  listAccessRequests(userUniqueId: string, fileUniqueId: string): Promise<FileAccess[]>;
  approveAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Promise<FileAccess>;
  denyAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Promise<void>;

  // Delegations
  listGrantedDelegations(userUniqueId: string): Promise<FileDelegation[]>;
  listReceivedDelegations(userUniqueId: string): Promise<FileDelegation[]>;
  getDelegation(userUniqueId: string, delegationUniqueId: string): Promise<FileDelegation>;
  createDelegation(userUniqueId: string, data: CreateDelegationRequest): Promise<FileDelegation>;
  revokeDelegation(userUniqueId: string, delegationUniqueId: string): Promise<void>;
}

export function createUserFilesService(transport: Transport, _config: { appId: string }): UserFilesService {
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
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}/tags`, {
        data: { tag: { unique_id: tagUniqueId } },
      });
    },

    async bulkUpdateTags(userUniqueId: string, tagUniqueIds: string[]): Promise<void> {
      await transport.post(`/users/${userUniqueId}/tags`, {
        tags: { unique_ids: tagUniqueIds },
      });
    },

    async requestAccess(userUniqueId: string, fileUniqueId: string): Promise<void> {
      await transport.post(`/users/${userUniqueId}/files/${fileUniqueId}/requests/access`, {});
    },

    async getAccess(userUniqueId: string, fileUniqueId: string): Promise<FileAccess[]> {
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

    async grantAccess(userUniqueId: string, fileUniqueId: string, data: FileAccessRequest): Promise<FileAccess> {
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

    async listAccessRequests(userUniqueId: string, fileUniqueId: string): Promise<FileAccess[]> {
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

    async approveAccessRequest(userUniqueId: string, fileUniqueId: string, requestUniqueId: string): Promise<FileAccess> {
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

    async listGrantedDelegations(userUniqueId: string): Promise<FileDelegation[]> {
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

    async listReceivedDelegations(userUniqueId: string): Promise<FileDelegation[]> {
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

    async getDelegation(userUniqueId: string, delegationUniqueId: string): Promise<FileDelegation> {
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

    async createDelegation(userUniqueId: string, data: CreateDelegationRequest): Promise<FileDelegation> {
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
