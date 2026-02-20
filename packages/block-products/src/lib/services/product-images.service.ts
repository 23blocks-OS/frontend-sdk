import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import { productImageMapper } from '../mappers/product.mapper.js';
import type { ProductImage } from '../types/product.js';

export interface PresignResponse {
  url: string;
  fields: Record<string, string>;
  key: string;
}

export interface CreateProductImageRequest {
  key: string;
  filename: string;
  contentType?: string;
  isPrimary?: boolean;
}

export interface ProductImagesService {
  /**
   * Get a presigned URL for uploading a product image.
   * @param productUniqueId - The product unique ID
   * @returns PresignResponse containing the upload URL, form fields, and storage key
   */
  presign(productUniqueId: string): Promise<PresignResponse>;

  /**
   * Get presigned URLs for a multipart upload of a large product image.
   * @param productUniqueId - The product unique ID
   * @param filename - The original filename
   * @param contentType - The MIME type of the file
   * @param totalParts - Number of parts the file will be split into
   * @returns Object containing the uploadId and an array of presigned URLs, one per part
   */
  multipartPresign(productUniqueId: string, filename: string, contentType: string, totalParts: number): Promise<{ uploadId: string; urls: string[] }>;

  /**
   * Complete a multipart upload by assembling uploaded parts.
   * @param productUniqueId - The product unique ID
   * @param uploadId - The multipart upload ID received from multipartPresign
   * @param key - The storage key for the assembled file
   * @param parts - Array of uploaded parts with their etag and part number
   * @returns Resolves when the multipart upload has been completed
   */
  multipartComplete(productUniqueId: string, uploadId: string, key: string, parts: { etag: string; partNumber: number }[]): Promise<void>;

  /**
   * Create a product image record after uploading the file.
   * @param productUniqueId - The product unique ID
   * @param data - Image metadata including the storage key, filename, content type, and primary flag
   * @returns The newly created ProductImage
   */
  create(productUniqueId: string, data: CreateProductImageRequest): Promise<ProductImage>;

  /**
   * Get a single product image by its unique identifier.
   * @param productUniqueId - The product unique ID
   * @param imageUniqueId - The image unique ID
   * @returns The matching ProductImage
   */
  get(productUniqueId: string, imageUniqueId: string): Promise<ProductImage>;

  /**
   * Update a product image (e.g., toggle primary status).
   * @param productUniqueId - The product unique ID
   * @param imageUniqueId - The image unique ID
   * @param data - Fields to update (isPrimary)
   * @returns The updated ProductImage
   */
  update(productUniqueId: string, imageUniqueId: string, data: { isPrimary?: boolean }): Promise<ProductImage>;

  /**
   * Delete a product image.
   * @param productUniqueId - The product unique ID
   * @param imageUniqueId - The image unique ID
   * @returns Resolves when the image has been deleted
   */
  delete(productUniqueId: string, imageUniqueId: string): Promise<void>;

  /**
   * Approve a product image for use.
   * @param productUniqueId - The product unique ID
   * @param imageUniqueId - The image unique ID
   * @returns The approved ProductImage
   */
  approve(productUniqueId: string, imageUniqueId: string): Promise<ProductImage>;

  /**
   * Publish a product image, making it publicly visible.
   * @param productUniqueId - The product unique ID
   * @param imageUniqueId - The image unique ID
   * @returns The published ProductImage
   */
  publish(productUniqueId: string, imageUniqueId: string): Promise<ProductImage>;
}

export function createProductImagesService(transport: Transport, _config: { apiKey: string }): ProductImagesService {
  return {
    async presign(productUniqueId: string): Promise<PresignResponse> {
      const response = await transport.put<any>(`/products/${productUniqueId}/presign`, {});
      return {
        url: response.url,
        fields: response.fields,
        key: response.key,
      };
    },

    async multipartPresign(productUniqueId: string, filename: string, contentType: string, totalParts: number): Promise<{ uploadId: string; urls: string[] }> {
      const response = await transport.post<any>(`/products/${productUniqueId}/multipart_presign_upload`, {
        filename,
        content_type: contentType,
        total_parts: totalParts,
      });
      return {
        uploadId: response.upload_id,
        urls: response.urls,
      };
    },

    async multipartComplete(productUniqueId: string, uploadId: string, key: string, parts: { etag: string; partNumber: number }[]): Promise<void> {
      await transport.post(`/products/${productUniqueId}/multipart_complete_upload`, {
        upload_id: uploadId,
        key,
        parts: parts.map((p) => ({ etag: p.etag, part_number: p.partNumber })),
      });
    },

    async create(productUniqueId: string, data: CreateProductImageRequest): Promise<ProductImage> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/images`, {
        file: {
          key: data.key,
          filename: data.filename,
          content_type: data.contentType,
          is_primary: data.isPrimary,
        },
      });
      return decodeOne(response, productImageMapper);
    },

    async get(productUniqueId: string, imageUniqueId: string): Promise<ProductImage> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/images/${imageUniqueId}`);
      return decodeOne(response, productImageMapper);
    },

    async update(productUniqueId: string, imageUniqueId: string, data: { isPrimary?: boolean }): Promise<ProductImage> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/images/${imageUniqueId}`, {
        file: {
          is_primary: data.isPrimary,
        },
      });
      return decodeOne(response, productImageMapper);
    },

    async delete(productUniqueId: string, imageUniqueId: string): Promise<void> {
      await transport.delete(`/products/${productUniqueId}/images/${imageUniqueId}`);
    },

    async approve(productUniqueId: string, imageUniqueId: string): Promise<ProductImage> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/images/${imageUniqueId}/approve`, {});
      return decodeOne(response, productImageMapper);
    },

    async publish(productUniqueId: string, imageUniqueId: string): Promise<ProductImage> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/images/${imageUniqueId}/publish`, {});
      return decodeOne(response, productImageMapper);
    },
  };
}
