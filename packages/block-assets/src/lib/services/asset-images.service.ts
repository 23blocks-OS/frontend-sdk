import type { Transport } from '@23blocks/contracts';
import type {
  AssetPresignResponse,
  CreateAssetImageRequest,
  AssetImage,
} from '../types/asset-image.js';

export interface AssetImagesService {
  /**
   * Get a presigned URL for uploading an asset image.
   * @returns AssetPresignResponse with `url`, `fields`, and `key`.
   */
  presign(assetUniqueId: string): Promise<AssetPresignResponse>;

  /**
   * Create an asset image record after upload.
   * @returns The newly created AssetImage record with URL.
   */
  create(assetUniqueId: string, data: CreateAssetImageRequest): Promise<AssetImage>;

  /**
   * Delete an asset image.
   */
  delete(assetUniqueId: string, imageUniqueId: string): Promise<void>;

  // Event images

  /**
   * Get a presigned URL for uploading an event image.
   * @returns AssetPresignResponse with `url`, `fields`, and `key`.
   */
  presignEvent(assetUniqueId: string, eventUniqueId: string): Promise<AssetPresignResponse>;

  /**
   * Create an event image record after upload.
   * @returns The newly created AssetImage record with URL.
   */
  createEventImage(assetUniqueId: string, eventUniqueId: string, data: CreateAssetImageRequest): Promise<AssetImage>;

  /**
   * Delete an event image.
   */
  deleteEventImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Promise<void>;
}

export function createAssetImagesService(transport: Transport, _config: { apiKey: string }): AssetImagesService {
  return {
    async presign(assetUniqueId: string): Promise<AssetPresignResponse> {
      const response = await transport.put<any>(`/assets/${assetUniqueId}/presign`, {});
      return {
        url: response.url,
        fields: response.fields,
        key: response.key,
      };
    },

    async create(assetUniqueId: string, data: CreateAssetImageRequest): Promise<AssetImage> {
      const response = await transport.post<any>(`/assets/${assetUniqueId}/images`, {
        image: {
          key: data.key,
          filename: data.filename,
          content_type: data.contentType,
        },
      });
      const d = response?.data ?? response ?? {};
      const a = d?.attributes ?? d ?? {};
      return {
        uniqueId: a.unique_id,
        url: a.url,
        filename: a.filename,
        contentType: a.content_type,
        createdAt: new Date(a.created_at),
      };
    },

    async delete(assetUniqueId: string, imageUniqueId: string): Promise<void> {
      await transport.delete(`/assets/${assetUniqueId}/images/${imageUniqueId}`);
    },

    async presignEvent(assetUniqueId: string, eventUniqueId: string): Promise<AssetPresignResponse> {
      const response = await transport.put<any>(`/assets/${assetUniqueId}/events/${eventUniqueId}/presign`, {});
      return {
        url: response.url,
        fields: response.fields,
        key: response.key,
      };
    },

    async createEventImage(assetUniqueId: string, eventUniqueId: string, data: CreateAssetImageRequest): Promise<AssetImage> {
      const response = await transport.post<any>(`/assets/${assetUniqueId}/events/${eventUniqueId}/images`, {
        image: {
          key: data.key,
          filename: data.filename,
          content_type: data.contentType,
        },
      });
      const d = response?.data ?? response ?? {};
      const a = d?.attributes ?? d ?? {};
      return {
        uniqueId: a.unique_id,
        url: a.url,
        filename: a.filename,
        contentType: a.content_type,
        createdAt: new Date(a.created_at),
      };
    },

    async deleteEventImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Promise<void> {
      await transport.delete(`/assets/${assetUniqueId}/events/${eventUniqueId}/images/${imageUniqueId}`);
    },
  };
}
