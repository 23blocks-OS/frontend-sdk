import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  LocationImage,
  CreateLocationImageRequest,
  PresignLocationImageRequest,
  PresignLocationImageResponse,
} from '../types/location-image';
import { locationImageMapper } from '../mappers/location-image.mapper';

export interface LocationImagesService {
  presign(locationUniqueId: string, data: PresignLocationImageRequest): Promise<PresignLocationImageResponse>;
  create(locationUniqueId: string, data: CreateLocationImageRequest): Promise<LocationImage>;
  delete(locationUniqueId: string, imageUniqueId: string): Promise<void>;
}

export function createLocationImagesService(transport: Transport, _config: { appId: string }): LocationImagesService {
  return {
    async presign(locationUniqueId: string, data: PresignLocationImageRequest): Promise<PresignLocationImageResponse> {
      const response = await transport.put<unknown>(`/locations/${locationUniqueId}/presign`, {
        file_name: data.fileName,
        content_type: data.contentType,
      });
      const result = response as Record<string, unknown>;
      return {
        uploadUrl: String(result['upload_url'] ?? result['url'] ?? ''),
        publicUrl: String(result['public_url'] ?? ''),
        fields: result['fields'] as Record<string, string> | undefined,
      };
    },

    async create(locationUniqueId: string, data: CreateLocationImageRequest): Promise<LocationImage> {
      const response = await transport.post<unknown>(`/locations/${locationUniqueId}/images`, {
        location_image: {
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          caption: data.caption,
          alt_text: data.altText,
          sort_order: data.sortOrder,
          is_primary: data.isPrimary,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationImageMapper);
    },

    async delete(locationUniqueId: string, imageUniqueId: string): Promise<void> {
      await transport.delete(`/locations/${locationUniqueId}/images/${imageUniqueId}`);
    },
  };
}
