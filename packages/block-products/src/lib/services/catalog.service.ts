import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Category,
  Brand,
  Vendor,
  Warehouse,
  Channel,
  Collection,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateBrandRequest,
  UpdateBrandRequest,
  CreateVendorRequest,
  UpdateVendorRequest,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  CreateChannelRequest,
  UpdateChannelRequest,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  ListCategoriesParams,
  ListVendorsParams,
  ListWarehousesParams,
} from '../types/catalog.js';
import {
  categoryMapper,
  brandMapper,
  vendorMapper,
  warehouseMapper,
  channelMapper,
  collectionMapper,
} from '../mappers/catalog.mapper.js';

export interface CategoriesService {
  /**
   * List categories with optional filtering and pagination.
   * @param params - Filter and pagination options including parent category, children, and products includes
   * @returns Paginated result containing an array of Category items and page metadata
   * @note Supports including related children and products via `withChildren` and `withProducts` params
   */
  list(params?: ListCategoriesParams): Promise<PageResult<Category>>;

  /**
   * Get a single category by its unique identifier.
   * @param uniqueId - The category unique ID
   * @returns The matching Category
   */
  get(uniqueId: string): Promise<Category>;

  /**
   * Create a new category.
   * @param data - Category creation payload including name, description, and optional parent reference
   * @returns The newly created Category
   */
  create(data: CreateCategoryRequest): Promise<Category>;

  /**
   * Update an existing category.
   * @param uniqueId - The category unique ID
   * @param data - Fields to update on the category
   * @returns The updated Category
   */
  update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category>;

  /**
   * Soft-delete a category.
   * @param uniqueId - The category unique ID
   * @returns Resolves when the category has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted category.
   * @param uniqueId - The category unique ID
   * @returns The recovered Category
   */
  recover(uniqueId: string): Promise<Category>;

  /**
   * Get the child categories of a parent category.
   * @param uniqueId - The parent category unique ID
   * @returns Array of child Category items
   */
  getChildren(uniqueId: string): Promise<Category[]>;
}

export interface BrandsService {
  /**
   * List brands with optional pagination.
   * @param page - Page number for pagination
   * @param perPage - Number of items per page
   * @returns Paginated result containing an array of Brand items and page metadata
   */
  list(page?: number, perPage?: number): Promise<PageResult<Brand>>;

  /**
   * Get a single brand by its unique identifier.
   * @param uniqueId - The brand unique ID
   * @returns The matching Brand
   */
  get(uniqueId: string): Promise<Brand>;

  /**
   * Create a new brand.
   * @param data - Brand creation payload including name and optional image URL
   * @returns The newly created Brand
   */
  create(data: CreateBrandRequest): Promise<Brand>;

  /**
   * Update an existing brand.
   * @param uniqueId - The brand unique ID
   * @param data - Fields to update on the brand
   * @returns The updated Brand
   */
  update(uniqueId: string, data: UpdateBrandRequest): Promise<Brand>;

  /**
   * Delete a brand.
   * @param uniqueId - The brand unique ID
   * @returns Resolves when the brand has been deleted
   */
  delete(uniqueId: string): Promise<void>;
}

export interface VendorsService {
  /**
   * List vendors with optional filtering and pagination.
   * @param params - Filter and pagination options including search
   * @returns Paginated result containing an array of Vendor items and page metadata
   */
  list(params?: ListVendorsParams): Promise<PageResult<Vendor>>;

  /**
   * Get a single vendor by its unique identifier.
   * @param uniqueId - The vendor unique ID
   * @returns The matching Vendor
   */
  get(uniqueId: string): Promise<Vendor>;

  /**
   * Create a new vendor.
   * @param data - Vendor creation payload including name, contact info, and tax ID
   * @returns The newly created Vendor
   */
  create(data: CreateVendorRequest): Promise<Vendor>;

  /**
   * Update an existing vendor.
   * @param uniqueId - The vendor unique ID
   * @param data - Fields to update on the vendor
   * @returns The updated Vendor
   */
  update(uniqueId: string, data: UpdateVendorRequest): Promise<Vendor>;

  /**
   * Delete a vendor.
   * @param uniqueId - The vendor unique ID
   * @returns Resolves when the vendor has been deleted
   */
  delete(uniqueId: string): Promise<void>;
}

export interface WarehousesService {
  /**
   * List warehouses with optional filtering and pagination.
   * @param params - Filter and pagination options including vendor filter
   * @returns Paginated result containing an array of Warehouse items and page metadata
   */
  list(params?: ListWarehousesParams): Promise<PageResult<Warehouse>>;

  /**
   * Get a single warehouse by its unique identifier.
   * @param uniqueId - The warehouse unique ID
   * @returns The matching Warehouse
   */
  get(uniqueId: string): Promise<Warehouse>;

  /**
   * Create a new warehouse.
   * @param data - Warehouse creation payload including name, vendor, and location references
   * @returns The newly created Warehouse
   */
  create(data: CreateWarehouseRequest): Promise<Warehouse>;

  /**
   * Update an existing warehouse.
   * @param uniqueId - The warehouse unique ID
   * @param data - Fields to update on the warehouse
   * @returns The updated Warehouse
   */
  update(uniqueId: string, data: UpdateWarehouseRequest): Promise<Warehouse>;

  /**
   * Delete a warehouse.
   * @param uniqueId - The warehouse unique ID
   * @returns Resolves when the warehouse has been deleted
   */
  delete(uniqueId: string): Promise<void>;
}

export interface ChannelsService {
  list(): Promise<Channel[]>;
  get(uniqueId: string): Promise<Channel>;
  create(data: CreateChannelRequest): Promise<Channel>;
  update(uniqueId: string, data: UpdateChannelRequest): Promise<Channel>;
  delete(uniqueId: string): Promise<void>;
}

export interface CollectionsService {
  list(): Promise<Collection[]>;
  get(uniqueId: string): Promise<Collection>;
  create(data: CreateCollectionRequest): Promise<Collection>;
  update(uniqueId: string, data: UpdateCollectionRequest): Promise<Collection>;
  delete(uniqueId: string): Promise<void>;
}

export function createCategoriesService(transport: Transport, _config: { apiKey: string }): CategoriesService {
  return {
    async list(params?: ListCategoriesParams): Promise<PageResult<Category>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.withChildren) queryParams['with'] = 'children';
      if (params?.withProducts) queryParams['with'] = params.withChildren ? 'children,products' : 'products';

      const response = await transport.get<unknown>('/categories', { params: queryParams });
      return decodePageResult(response, categoryMapper);
    },

    async get(uniqueId: string): Promise<Category> {
      const response = await transport.get<unknown>(`/categories/${uniqueId}`);
      return decodeOne(response, categoryMapper);
    },

    async create(data: CreateCategoryRequest): Promise<Category> {
      const response = await transport.post<unknown>('/categories', {
        category: {
          name: data.name,
          description: data.description,
          code: data.code,
          parent_id: data.parentId,
          display_order: data.displayOrder,
          image_url: data.imageUrl,
          icon_url: data.iconUrl,
          content_url: data.contentUrl,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category> {
      const response = await transport.put<unknown>(`/categories/${uniqueId}`, {
        category: {
          name: data.name,
          description: data.description,
          code: data.code,
          parent_id: data.parentId,
          display_order: data.displayOrder,
          image_url: data.imageUrl,
          icon_url: data.iconUrl,
          content_url: data.contentUrl,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/categories/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Category> {
      const response = await transport.put<unknown>(`/categories/${uniqueId}/recover`, {});
      return decodeOne(response, categoryMapper);
    },

    async getChildren(uniqueId: string): Promise<Category[]> {
      const response = await transport.get<unknown>(`/categories/${uniqueId}/children`);
      return decodeMany(response, categoryMapper);
    },
  };
}

export function createBrandsService(transport: Transport, _config: { apiKey: string }): BrandsService {
  return {
    async list(page?: number, perPage?: number): Promise<PageResult<Brand>> {
      const params: Record<string, string> = {};
      if (page) params['page'] = String(page);
      if (perPage) params['records'] = String(perPage);

      const response = await transport.get<unknown>('/brands', { params });
      return decodePageResult(response, brandMapper);
    },

    async get(uniqueId: string): Promise<Brand> {
      const response = await transport.get<unknown>(`/brands/${uniqueId}`);
      return decodeOne(response, brandMapper);
    },

    async create(data: CreateBrandRequest): Promise<Brand> {
      const response = await transport.post<unknown>('/brands', {
        brand: {
          name: data.name,
          code: data.code,
          image_url: data.imageUrl,
          thumbnail_url: data.thumbnailUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          is_global: data.isGlobal,
          country_id: data.countryId,
          country_name: data.countryName,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
        },
      });
      return decodeOne(response, brandMapper);
    },

    async update(uniqueId: string, data: UpdateBrandRequest): Promise<Brand> {
      const response = await transport.put<unknown>(`/brands/${uniqueId}`, {
        brand: {
          name: data.name,
          code: data.code,
          image_url: data.imageUrl,
          thumbnail_url: data.thumbnailUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          is_global: data.isGlobal,
          country_id: data.countryId,
          country_name: data.countryName,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
        },
      });
      return decodeOne(response, brandMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/brands/${uniqueId}`);
    },
  };
}

export function createVendorsService(transport: Transport, _config: { apiKey: string }): VendorsService {
  return {
    async list(params?: ListVendorsParams): Promise<PageResult<Vendor>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/vendors', { params: queryParams });
      return decodePageResult(response, vendorMapper);
    },

    async get(uniqueId: string): Promise<Vendor> {
      const response = await transport.get<unknown>(`/vendors/${uniqueId}`);
      return decodeOne(response, vendorMapper);
    },

    async create(data: CreateVendorRequest): Promise<Vendor> {
      const response = await transport.post<unknown>('/vendors', {
        vendor: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          contact_name: data.contactName,
          tax_id: data.taxId,
          image_url: data.imageUrl,
          code: data.code,
          thumbnail_url: data.thumbnailUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, vendorMapper);
    },

    async update(uniqueId: string, data: UpdateVendorRequest): Promise<Vendor> {
      const response = await transport.put<unknown>(`/vendors/${uniqueId}`, {
        vendor: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          contact_name: data.contactName,
          tax_id: data.taxId,
          image_url: data.imageUrl,
          code: data.code,
          thumbnail_url: data.thumbnailUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, vendorMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/vendors/${uniqueId}`);
    },
  };
}

export function createWarehousesService(transport: Transport, _config: { apiKey: string }): WarehousesService {
  return {
    async list(params?: ListWarehousesParams): Promise<PageResult<Warehouse>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.vendorUniqueId) queryParams['vendor_unique_id'] = params.vendorUniqueId;

      const response = await transport.get<unknown>('/warehouses', { params: queryParams });
      return decodePageResult(response, warehouseMapper);
    },

    async get(uniqueId: string): Promise<Warehouse> {
      const response = await transport.get<unknown>(`/warehouses/${uniqueId}`);
      return decodeOne(response, warehouseMapper);
    },

    async create(data: CreateWarehouseRequest): Promise<Warehouse> {
      const response = await transport.post<unknown>('/warehouses', {
        warehouse: {
          name: data.name,
          vendor_unique_id: data.vendorUniqueId,
          address_unique_id: data.addressUniqueId,
          location_unique_id: data.locationUniqueId,
          is_global: data.isGlobal,
          code: data.code,
          is_multichannel: data.isMultichannel,
          channel_unique_id: data.channelUniqueId,
          channel_code: data.channelCode,
          channel_name: data.channelName,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, warehouseMapper);
    },

    async update(uniqueId: string, data: UpdateWarehouseRequest): Promise<Warehouse> {
      const response = await transport.put<unknown>(`/warehouses/${uniqueId}`, {
        warehouse: {
          name: data.name,
          vendor_unique_id: data.vendorUniqueId,
          address_unique_id: data.addressUniqueId,
          location_unique_id: data.locationUniqueId,
          is_global: data.isGlobal,
          code: data.code,
          is_multichannel: data.isMultichannel,
          channel_unique_id: data.channelUniqueId,
          channel_code: data.channelCode,
          channel_name: data.channelName,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, warehouseMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/warehouses/${uniqueId}`);
    },
  };
}

export function createChannelsService(transport: Transport, _config: { apiKey: string }): ChannelsService {
  return {
    async list(): Promise<Channel[]> {
      const response = await transport.get<unknown>('/channels');
      return decodeMany(response, channelMapper);
    },

    async get(uniqueId: string): Promise<Channel> {
      const response = await transport.get<unknown>(`/channels/${uniqueId}`);
      return decodeOne(response, channelMapper);
    },

    async create(data: CreateChannelRequest): Promise<Channel> {
      const response = await transport.post<unknown>('/channels', {
        channel: {
          code: data.code,
          name: data.name,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          currency_unique_id: data.currencyUniqueId,
          currency_code: data.currencyCode,
          currency_name: data.currencyName,
          api_description: data.apiDescription,
          api_url: data.apiUrl,
          api_keys_description: data.apiKeysDescription,
          api_keys_id: data.apiKeysId,
        },
      });
      return decodeOne(response, channelMapper);
    },

    async update(uniqueId: string, data: UpdateChannelRequest): Promise<Channel> {
      const response = await transport.put<unknown>(`/channels/${uniqueId}`, {
        channel: {
          code: data.code,
          name: data.name,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          currency_unique_id: data.currencyUniqueId,
          currency_code: data.currencyCode,
          currency_name: data.currencyName,
          api_description: data.apiDescription,
          api_url: data.apiUrl,
          api_keys_description: data.apiKeysDescription,
          api_keys_id: data.apiKeysId,
          status: data.status,
        },
      });
      return decodeOne(response, channelMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/channels/${uniqueId}`);
    },
  };
}

export function createCollectionsService(transport: Transport, _config: { apiKey: string }): CollectionsService {
  return {
    async list(): Promise<Collection[]> {
      const response = await transport.get<unknown>('/collections');
      return decodeMany(response, collectionMapper);
    },

    async get(uniqueId: string): Promise<Collection> {
      const response = await transport.get<unknown>(`/collections/${uniqueId}`);
      return decodeOne(response, collectionMapper);
    },

    async create(data: CreateCollectionRequest): Promise<Collection> {
      const response = await transport.post<unknown>('/collections', {
        collection: {
          code: data.code,
          name: data.name,
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
          slug: data.slug,
          status: data.status,
        },
      });
      return decodeOne(response, collectionMapper);
    },

    async update(uniqueId: string, data: UpdateCollectionRequest): Promise<Collection> {
      const response = await transport.put<unknown>(`/collections/${uniqueId}`, {
        collection: {
          code: data.code,
          name: data.name,
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
          slug: data.slug,
          status: data.status,
        },
      });
      return decodeOne(response, collectionMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/collections/${uniqueId}`);
    },
  };
}
