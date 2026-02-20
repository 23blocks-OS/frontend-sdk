import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  LocationImage,
  CreateLocationImageRequest,
  PresignLocationImageRequest,
  PresignLocationImageResponse,
} from '../types/location-image.js';
import { locationImageMapper } from '../mappers/location-image.mapper.js';

export interface LocationImagesService {
  /**
   * Get a presigned URL for uploading a location image
   * @param locationUniqueId - The unique identifier of the location
   * @param data - Upload metadata including file name and content type
   * @returns Presigned upload URL, public URL, and optional form fields
   */
  presign(locationUniqueId: string, data: PresignLocationImageRequest): Promise<PresignLocationImageResponse>;

  /**
   * Create a location image record after upload
   * @param locationUniqueId - The unique identifier of the location
   * @param data - Image details including URL, caption, alt text, and sort order
   * @returns The newly created LocationImage record
   */
  create(locationUniqueId: string, data: CreateLocationImageRequest): Promise<LocationImage>;

  /**
   * Delete a location image
   * @param locationUniqueId - The unique identifier of the location
   * @param imageUniqueId - The unique identifier of the image to delete
   * @returns Resolves when the image has been deleted
   */
  delete(locationUniqueId: string, imageUniqueId: string): Promise<void>;
}

export function createLocationImagesService(transport: Transport, _config: { apiKey: string }): LocationImagesService {
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
