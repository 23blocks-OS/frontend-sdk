import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Warehouse,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  ListWarehousesParams,
} from '../types/warehouse';
import { warehouseMapper } from '../mappers/warehouse.mapper';

export interface WarehousesService {
  list(params?: ListWarehousesParams): Promise<PageResult<Warehouse>>;
  get(uniqueId: string): Promise<Warehouse>;
  create(data: CreateWarehouseRequest): Promise<Warehouse>;
  update(uniqueId: string, data: UpdateWarehouseRequest): Promise<Warehouse>;
  delete(uniqueId: string): Promise<void>;
}

export function createWarehousesService(transport: Transport, _config: { appId: string }): WarehousesService {
  return {
    async list(params?: ListWarehousesParams): Promise<PageResult<Warehouse>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

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
          description: data.description,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zip_code: data.zipCode,
          latitude: data.latitude,
          longitude: data.longitude,
          payload: data.payload,
        },
      });
      return decodeOne(response, warehouseMapper);
    },

    async update(uniqueId: string, data: UpdateWarehouseRequest): Promise<Warehouse> {
      const response = await transport.put<unknown>(`/warehouses/${uniqueId}`, {
        warehouse: {
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zip_code: data.zipCode,
          latitude: data.latitude,
          longitude: data.longitude,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, warehouseMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/warehouses/${uniqueId}`);
    },
  };
}
