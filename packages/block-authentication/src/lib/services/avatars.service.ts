import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  UserAvatarFull,
  CreateAvatarRequest,
  AvatarPresignResponse,
  MultipartPresignRequest,
  MultipartPresignResponse,
  MultipartCompleteRequest,
  MultipartCompleteResponse,
} from '../types/index.js';
import type { ListParams } from '@23blocks/contracts';

// Avatar mapper
const avatarMapper = {
  type: 'user_avatar',
  map: (data: Record<string, unknown>): UserAvatarFull => ({
    id: String(data['id'] ?? ''),
    uniqueId: String(data['unique_id'] ?? ''),
    userId: String(data['user_id'] ?? ''),
    userUniqueId: String(data['user_unique_id'] ?? ''),
    bucket: data['bucket'] as string | undefined,
    originalName: data['original_name'] as string | undefined,
    name: data['name'] as string | undefined,
    url: data['url'] as string | undefined,
    thumbnail: data['thumbnail'] as string | undefined,
    fileType: data['file_type'] as string | undefined,
    fileSize: data['file_size'] as number | undefined,
    description: data['description'] as string | undefined,
    originalFile: data['original_file'] as string | undefined,
    isPublic: data['is_public'] as boolean | undefined,
    status: data['status'] as string | undefined,
    createdAt: data['created_at'] as string | undefined,
    updatedAt: data['updated_at'] as string | undefined,
  }),
};

/**
 * Avatars Service Interface
 */
export interface AvatarsService {
  /**
   * List avatars for a user
   */
  list(userUniqueId: string, params?: ListParams): Promise<PageResult<UserAvatarFull>>;

  /**
   * Get a specific avatar
   */
  get(userUniqueId: string): Promise<UserAvatarFull>;

  /**
   * Create/update an avatar
   */
  create(userUniqueId: string, request: CreateAvatarRequest): Promise<UserAvatarFull>;

  /**
   * Update an avatar
   */
  update(userUniqueId: string, request: Partial<CreateAvatarRequest>): Promise<UserAvatarFull>;

  /**
   * Delete an avatar
   */
  delete(userUniqueId: string): Promise<void>;

  /**
   * Get presigned URL for direct upload
   */
  presignUpload(userUniqueId: string, filename: string): Promise<AvatarPresignResponse>;

  /**
   * Get presigned URLs for multipart upload
   */
  multipartPresign(userUniqueId: string, request: MultipartPresignRequest): Promise<MultipartPresignResponse>;

  /**
   * Complete a multipart upload
   */
  multipartComplete(userUniqueId: string, request: MultipartCompleteRequest): Promise<MultipartCompleteResponse>;
}

/**
 * Create the Avatars service
 */
export function createAvatarsService(transport: Transport): AvatarsService {
  return {
    async list(userUniqueId: string, params?: ListParams): Promise<PageResult<UserAvatarFull>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/avatars`, { params: queryParams });
      return decodePageResult(response, avatarMapper);
    },

    async get(userUniqueId: string): Promise<UserAvatarFull> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/avatars/${userUniqueId}`);
      return decodeOne(response, avatarMapper);
    },

    async create(userUniqueId: string, request: CreateAvatarRequest): Promise<UserAvatarFull> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/avatars`, {
        avatar: {
          original_name: request.originalName,
          name: request.name,
          url: request.url,
          thumbnail: request.thumbnail,
          file_type: request.fileType,
          file_size: request.fileSize,
          description: request.description,
          original_file: request.originalFile,
          is_public: request.isPublic,
        },
      });
      return decodeOne(response, avatarMapper);
    },

    async update(userUniqueId: string, request: Partial<CreateAvatarRequest>): Promise<UserAvatarFull> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/avatars/${userUniqueId}`, {
        avatar: {
          original_name: request.originalName,
          name: request.name,
          url: request.url,
          thumbnail: request.thumbnail,
          file_type: request.fileType,
          file_size: request.fileSize,
          description: request.description,
          original_file: request.originalFile,
          is_public: request.isPublic,
        },
      });
      return decodeOne(response, avatarMapper);
    },

    async delete(userUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/avatars/${userUniqueId}`);
    },

    async presignUpload(userUniqueId: string, filename: string): Promise<AvatarPresignResponse> {
      const response = await transport.put<{
        upload_url: string;
        public_url: string;
        key: string;
      }>(`/users/${userUniqueId}/avatars/presign_upload`, {
        filename,
      });

      return {
        uploadUrl: response.upload_url,
        publicUrl: response.public_url,
        key: response.key,
      };
    },

    async multipartPresign(userUniqueId: string, request: MultipartPresignRequest): Promise<MultipartPresignResponse> {
      const response = await transport.post<{
        upload_id: string;
        key: string;
        parts: Array<{
          part_number: number;
          upload_url: string;
        }>;
      }>(`/users/${userUniqueId}/avatars/multipart_presign`, {
        unique_id: userUniqueId,
        filename: request.filename,
        part_count: request.partCount,
      });

      return {
        uploadId: response.upload_id,
        key: response.key,
        parts: response.parts.map((p) => ({
          partNumber: p.part_number,
          uploadUrl: p.upload_url,
        })),
      };
    },

    async multipartComplete(userUniqueId: string, request: MultipartCompleteRequest): Promise<MultipartCompleteResponse> {
      const response = await transport.post<{
        public_url: string;
        file_name: string;
      }>(`/users/${userUniqueId}/avatars/multipart_complete`, {
        unique_id: userUniqueId,
        filename: request.filename,
        upload_id: request.uploadId,
        parts: request.parts,
      });

      return {
        publicUrl: response.public_url,
        fileName: response.file_name,
      };
    },
  };
}
