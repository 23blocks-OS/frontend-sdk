import type { Transport } from '@23blocks/contracts';
import type {
  AssetPresignResponse,
  CreateAssetImageRequest,
  AssetImage,
} from '../types/asset-image';

export interface AssetImagesService {
  presign(assetUniqueId: string): Promise<AssetPresignResponse>;
  create(assetUniqueId: string, data: CreateAssetImageRequest): Promise<AssetImage>;
  delete(assetUniqueId: string, imageUniqueId: string): Promise<void>;
  // Event images
  presignEvent(assetUniqueId: string, eventUniqueId: string): Promise<AssetPresignResponse>;
  createEventImage(assetUniqueId: string, eventUniqueId: string, data: CreateAssetImageRequest): Promise<AssetImage>;
  deleteEventImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Promise<void>;
}

export function createAssetImagesService(transport: Transport, _config: { appId: string }): AssetImagesService {
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
      return {
        uniqueId: response.unique_id,
        url: response.url,
        filename: response.filename,
        contentType: response.content_type,
        createdAt: new Date(response.created_at),
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
      return {
        uniqueId: response.unique_id,
        url: response.url,
        filename: response.filename,
        contentType: response.content_type,
        createdAt: new Date(response.created_at),
      };
    },

    async deleteEventImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Promise<void> {
      await transport.delete(`/assets/${assetUniqueId}/events/${eventUniqueId}/images/${imageUniqueId}`);
    },
  };
}
