import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Vendor,
  CreateVendorRequest,
  UpdateVendorRequest,
  ListVendorsParams,
} from '../types/vendor';
import { vendorMapper } from '../mappers/vendor.mapper';

export interface VendorsService {
  list(params?: ListVendorsParams): Promise<PageResult<Vendor>>;
  get(uniqueId: string): Promise<Vendor>;
  create(data: CreateVendorRequest): Promise<Vendor>;
  update(uniqueId: string, data: UpdateVendorRequest): Promise<Vendor>;
  delete(uniqueId: string): Promise<void>;
}

export function createVendorsService(transport: Transport, _config: { appId: string }): VendorsService {
  return {
    async list(params?: ListVendorsParams): Promise<PageResult<Vendor>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
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
          description: data.description,
          email: data.email,
          phone: data.phone,
          address: data.address,
          payload: data.payload,
        },
      });
      return decodeOne(response, vendorMapper);
    },

    async update(uniqueId: string, data: UpdateVendorRequest): Promise<Vendor> {
      const response = await transport.put<unknown>(`/vendors/${uniqueId}`, {
        vendor: {
          name: data.name,
          description: data.description,
          email: data.email,
          phone: data.phone,
          address: data.address,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, vendorMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/vendors/${uniqueId}`);
    },
  };
}
