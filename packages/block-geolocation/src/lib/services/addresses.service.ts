import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  ListAddressesParams,
} from '../types/address';
import { addressMapper } from '../mappers/address.mapper';

export interface AddressesService {
  list(params?: ListAddressesParams): Promise<PageResult<Address>>;
  get(uniqueId: string): Promise<Address>;
  create(data: CreateAddressRequest): Promise<Address>;
  update(uniqueId: string, data: UpdateAddressRequest): Promise<Address>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Address>;
  search(query: string, params?: ListAddressesParams): Promise<PageResult<Address>>;
  listDeleted(params?: ListAddressesParams): Promise<PageResult<Address>>;
  setDefault(uniqueId: string): Promise<Address>;
}

export function createAddressesService(transport: Transport, _config: { appId: string }): AddressesService {
  return {
    async list(params?: ListAddressesParams): Promise<PageResult<Address>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.ownerUniqueId) queryParams['owner_unique_id'] = params.ownerUniqueId;
      if (params?.ownerType) queryParams['owner_type'] = params.ownerType;
      if (params?.countryCode) queryParams['country_code'] = params.countryCode;
      if (params?.defaultOnly) queryParams['default_only'] = 'true';
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/addresses', { params: queryParams });
      return decodePageResult(response, addressMapper);
    },

    async get(uniqueId: string): Promise<Address> {
      const response = await transport.get<unknown>(`/addresses/${uniqueId}`);
      return decodeOne(response, addressMapper);
    },

    async create(data: CreateAddressRequest): Promise<Address> {
      const response = await transport.post<unknown>('/addresses', {
        address: {
            owner_unique_id: data.ownerUniqueId,
            owner_type: data.ownerType,
            country_code: data.countryCode,
            address: data.address,
            postal_code: data.postalCode,
            first_name: data.firstName,
            last_name: data.lastName,
            organization: data.organization,
            latitude: data.latitude,
            longitude: data.longitude,
            default_address: data.defaultAddress,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, addressMapper);
    },

    async update(uniqueId: string, data: UpdateAddressRequest): Promise<Address> {
      const response = await transport.put<unknown>(`/addresses/${uniqueId}`, {
        address: {
            country_code: data.countryCode,
            address: data.address,
            postal_code: data.postalCode,
            first_name: data.firstName,
            last_name: data.lastName,
            organization: data.organization,
            latitude: data.latitude,
            longitude: data.longitude,
            enabled: data.enabled,
            status: data.status,
            default_address: data.defaultAddress,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, addressMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/addresses/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Address> {
      const response = await transport.put<unknown>(`/addresses/${uniqueId}/recover`, {});
      return decodeOne(response, addressMapper);
    },

    async search(query: string, params?: ListAddressesParams): Promise<PageResult<Address>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/addresses/search', { search: query }, { params: queryParams });
      return decodePageResult(response, addressMapper);
    },

    async listDeleted(params?: ListAddressesParams): Promise<PageResult<Address>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/addresses/trash/show', { params: queryParams });
      return decodePageResult(response, addressMapper);
    },

    async setDefault(uniqueId: string): Promise<Address> {
      const response = await transport.put<unknown>(`/addresses/${uniqueId}/set-default`, {});
      return decodeOne(response, addressMapper);
    },
  };
}
