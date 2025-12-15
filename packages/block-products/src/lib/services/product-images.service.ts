import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import { productImageMapper } from '../mappers/product.mapper';
import type { ProductImage } from '../types/product';

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
  presign(productUniqueId: string): Promise<PresignResponse>;
  multipartPresign(productUniqueId: string, filename: string, contentType: string, totalParts: number): Promise<{ uploadId: string; urls: string[] }>;
  multipartComplete(productUniqueId: string, uploadId: string, key: string, parts: { etag: string; partNumber: number }[]): Promise<void>;
  create(productUniqueId: string, data: CreateProductImageRequest): Promise<ProductImage>;
  get(productUniqueId: string, imageUniqueId: string): Promise<ProductImage>;
  update(productUniqueId: string, imageUniqueId: string, data: { isPrimary?: boolean }): Promise<ProductImage>;
  delete(productUniqueId: string, imageUniqueId: string): Promise<void>;
  approve(productUniqueId: string, imageUniqueId: string): Promise<ProductImage>;
  publish(productUniqueId: string, imageUniqueId: string): Promise<ProductImage>;
}

export function createProductImagesService(transport: Transport, _config: { appId: string }): ProductImagesService {
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
