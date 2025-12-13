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
  ListCategoriesParams,
  ListVendorsParams,
  ListWarehousesParams,
} from '../types/catalog';
import {
  categoryMapper,
  brandMapper,
  vendorMapper,
  warehouseMapper,
  channelMapper,
  collectionMapper,
} from '../mappers/catalog.mapper';

export interface CategoriesService {
  list(params?: ListCategoriesParams): Promise<PageResult<Category>>;
  get(uniqueId: string): Promise<Category>;
  create(data: CreateCategoryRequest): Promise<Category>;
  update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Category>;
  getChildren(uniqueId: string): Promise<Category[]>;
}

export interface BrandsService {
  list(page?: number, perPage?: number): Promise<PageResult<Brand>>;
  get(uniqueId: string): Promise<Brand>;
  create(data: CreateBrandRequest): Promise<Brand>;
  update(uniqueId: string, data: UpdateBrandRequest): Promise<Brand>;
  delete(uniqueId: string): Promise<void>;
}

export interface VendorsService {
  list(params?: ListVendorsParams): Promise<PageResult<Vendor>>;
  get(uniqueId: string): Promise<Vendor>;
  create(data: CreateVendorRequest): Promise<Vendor>;
  update(uniqueId: string, data: UpdateVendorRequest): Promise<Vendor>;
  delete(uniqueId: string): Promise<void>;
}

export interface WarehousesService {
  list(params?: ListWarehousesParams): Promise<PageResult<Warehouse>>;
  get(uniqueId: string): Promise<Warehouse>;
  create(data: CreateWarehouseRequest): Promise<Warehouse>;
  update(uniqueId: string, data: UpdateWarehouseRequest): Promise<Warehouse>;
  delete(uniqueId: string): Promise<void>;
}

export interface ChannelsService {
  list(): Promise<Channel[]>;
  get(uniqueId: string): Promise<Channel>;
}

export interface CollectionsService {
  list(): Promise<Collection[]>;
  get(uniqueId: string): Promise<Collection>;
}

export function createCategoriesService(transport: Transport, _config: { appId: string }): CategoriesService {
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
        data: {
          type: 'Category',
          attributes: {
            name: data.name,
            description: data.description,
            parent_unique_id: data.parentUniqueId,
            display_order: data.displayOrder,
            image_url: data.imageUrl,
            icon_url: data.iconUrl,
          },
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category> {
      const response = await transport.put<unknown>(`/categories/${uniqueId}`, {
        data: {
          type: 'Category',
          attributes: {
            name: data.name,
            description: data.description,
            parent_unique_id: data.parentUniqueId,
            display_order: data.displayOrder,
            image_url: data.imageUrl,
            icon_url: data.iconUrl,
            enabled: data.enabled,
            status: data.status,
          },
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

export function createBrandsService(transport: Transport, _config: { appId: string }): BrandsService {
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
        data: {
          type: 'Brand',
          attributes: {
            name: data.name,
            image_url: data.imageUrl,
            is_global: data.isGlobal,
            country_id: data.countryId,
          },
        },
      });
      return decodeOne(response, brandMapper);
    },

    async update(uniqueId: string, data: UpdateBrandRequest): Promise<Brand> {
      const response = await transport.put<unknown>(`/brands/${uniqueId}`, {
        data: {
          type: 'Brand',
          attributes: {
            name: data.name,
            image_url: data.imageUrl,
            is_global: data.isGlobal,
            country_id: data.countryId,
            enabled: data.enabled,
            status: data.status,
          },
        },
      });
      return decodeOne(response, brandMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/brands/${uniqueId}`);
    },
  };
}

export function createVendorsService(transport: Transport, _config: { appId: string }): VendorsService {
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
        data: {
          type: 'Vendor',
          attributes: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            contact_name: data.contactName,
            tax_id: data.taxId,
            image_url: data.imageUrl,
          },
        },
      });
      return decodeOne(response, vendorMapper);
    },

    async update(uniqueId: string, data: UpdateVendorRequest): Promise<Vendor> {
      const response = await transport.put<unknown>(`/vendors/${uniqueId}`, {
        data: {
          type: 'Vendor',
          attributes: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            contact_name: data.contactName,
            tax_id: data.taxId,
            image_url: data.imageUrl,
            enabled: data.enabled,
            status: data.status,
          },
        },
      });
      return decodeOne(response, vendorMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/vendors/${uniqueId}`);
    },
  };
}

export function createWarehousesService(transport: Transport, _config: { appId: string }): WarehousesService {
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
        data: {
          type: 'Warehouse',
          attributes: {
            name: data.name,
            vendor_unique_id: data.vendorUniqueId,
            address_unique_id: data.addressUniqueId,
            location_unique_id: data.locationUniqueId,
            is_global: data.isGlobal,
          },
        },
      });
      return decodeOne(response, warehouseMapper);
    },

    async update(uniqueId: string, data: UpdateWarehouseRequest): Promise<Warehouse> {
      const response = await transport.put<unknown>(`/warehouses/${uniqueId}`, {
        data: {
          type: 'Warehouse',
          attributes: {
            name: data.name,
            address_unique_id: data.addressUniqueId,
            location_unique_id: data.locationUniqueId,
            is_global: data.isGlobal,
            enabled: data.enabled,
            status: data.status,
          },
        },
      });
      return decodeOne(response, warehouseMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/warehouses/${uniqueId}`);
    },
  };
}

export function createChannelsService(transport: Transport, _config: { appId: string }): ChannelsService {
  return {
    async list(): Promise<Channel[]> {
      const response = await transport.get<unknown>('/channels');
      return decodeMany(response, channelMapper);
    },

    async get(uniqueId: string): Promise<Channel> {
      const response = await transport.get<unknown>(`/channels/${uniqueId}`);
      return decodeOne(response, channelMapper);
    },
  };
}

export function createCollectionsService(transport: Transport, _config: { appId: string }): CollectionsService {
  return {
    async list(): Promise<Collection[]> {
      const response = await transport.get<unknown>('/collections');
      return decodeMany(response, collectionMapper);
    },

    async get(uniqueId: string): Promise<Collection> {
      const response = await transport.get<unknown>(`/collections/${uniqueId}`);
      return decodeOne(response, collectionMapper);
    },
  };
}
