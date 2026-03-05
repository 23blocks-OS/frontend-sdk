import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductCatalog,
  CreateProductCatalogRequest,
  UpdateProductCatalogRequest,
} from '../types/catalog.js';
import { productCatalogMapper } from '../mappers/catalog.mapper.js';

export interface CatalogsService {
  list(page?: number, perPage?: number): Promise<PageResult<ProductCatalog>>;
  get(uniqueId: string): Promise<ProductCatalog>;
  create(data: CreateProductCatalogRequest): Promise<ProductCatalog>;
  update(uniqueId: string, data: UpdateProductCatalogRequest): Promise<ProductCatalog>;
  delete(uniqueId: string): Promise<void>;
}

export function createCatalogsService(transport: Transport, _config: { apiKey: string }): CatalogsService {
  return {
    async list(page?: number, perPage?: number): Promise<PageResult<ProductCatalog>> {
      const params: Record<string, string> = {};
      if (page) params['page'] = String(page);
      if (perPage) params['records'] = String(perPage);

      const response = await transport.get<unknown>('/catalogs', { params });
      return decodePageResult(response, productCatalogMapper);
    },

    async get(uniqueId: string): Promise<ProductCatalog> {
      const response = await transport.get<unknown>(`/catalogs/${uniqueId}`);
      return decodeOne(response, productCatalogMapper);
    },

    async create(data: CreateProductCatalogRequest): Promise<ProductCatalog> {
      const response = await transport.post<unknown>('/catalogs', {
        catalog: {
          code: data.code,
          name: data.name,
          description: data.description,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          image_url: data.imageUrl,
          thumbnail_url: data.thumbnailUrl,
          items_counter: data.itemsCounter,
          is_global: data.isGlobal,
          country_id: data.countryId,
          country_name: data.countryName,
          currency_unique_id: data.currencyUniqueId,
          currency_code: data.currencyCode,
          currency_name: data.currencyName,
          is_multichannel: data.isMultichannel,
          channel_unique_id: data.channelUniqueId,
          channel_code: data.channelCode,
          channel_name: data.channelName,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          status: data.status,
        },
      });
      return decodeOne(response, productCatalogMapper);
    },

    async update(uniqueId: string, data: UpdateProductCatalogRequest): Promise<ProductCatalog> {
      const response = await transport.put<unknown>(`/catalogs/${uniqueId}`, {
        catalog: {
          code: data.code,
          name: data.name,
          description: data.description,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          image_url: data.imageUrl,
          thumbnail_url: data.thumbnailUrl,
          items_counter: data.itemsCounter,
          is_global: data.isGlobal,
          country_id: data.countryId,
          country_name: data.countryName,
          currency_unique_id: data.currencyUniqueId,
          currency_code: data.currencyCode,
          currency_name: data.currencyName,
          is_multichannel: data.isMultichannel,
          channel_unique_id: data.channelUniqueId,
          channel_code: data.channelCode,
          channel_name: data.channelName,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          status: data.status,
        },
      });
      return decodeOne(response, productCatalogMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/catalogs/${uniqueId}`);
    },
  };
}
