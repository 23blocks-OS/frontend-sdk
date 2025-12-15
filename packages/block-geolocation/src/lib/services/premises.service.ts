import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Premise,
  CreatePremiseRequest,
  UpdatePremiseRequest,
  ListPremisesParams,
} from '../types/premise';
import { premiseMapper } from '../mappers/premise.mapper';

export interface PremisesService {
  list(params?: ListPremisesParams): Promise<PageResult<Premise>>;
  get(uniqueId: string): Promise<Premise>;
  create(data: CreatePremiseRequest): Promise<Premise>;
  update(uniqueId: string, data: UpdatePremiseRequest): Promise<Premise>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Premise>;
  search(query: string, params?: ListPremisesParams): Promise<PageResult<Premise>>;
  listDeleted(params?: ListPremisesParams): Promise<PageResult<Premise>>;
}

export function createPremisesService(transport: Transport, _config: { appId: string }): PremisesService {
  return {
    async list(params?: ListPremisesParams): Promise<PageResult<Premise>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.premiseType) queryParams['premise_type'] = params.premiseType;
      if (params?.locationUniqueId) queryParams['location_unique_id'] = params.locationUniqueId;
      if (params?.addressUniqueId) queryParams['address_unique_id'] = params.addressUniqueId;
      if (params?.areaUniqueId) queryParams['area_unique_id'] = params.areaUniqueId;
      if (params?.parentId) queryParams['parent_id'] = params.parentId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/premises', { params: queryParams });
      return decodePageResult(response, premiseMapper);
    },

    async get(uniqueId: string): Promise<Premise> {
      const response = await transport.get<unknown>(`/premises/${uniqueId}`);
      return decodeOne(response, premiseMapper);
    },

    async create(data: CreatePremiseRequest): Promise<Premise> {
      const response = await transport.post<unknown>('/premises', {
        premise: {
            name: data.name,
            code: data.code,
            address_unique_id: data.addressUniqueId,
            area_unique_id: data.areaUniqueId,
            location_unique_id: data.locationUniqueId,
            parent_id: data.parentId,
            premise_type: data.premiseType,
            floor: data.floor,
            description: data.description,
            access_instructions: data.accessInstructions,
            capacity: data.capacity,
            allow_booking_overlap: data.allowBookingOverlap,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, premiseMapper);
    },

    async update(uniqueId: string, data: UpdatePremiseRequest): Promise<Premise> {
      const response = await transport.put<unknown>(`/premises/${uniqueId}`, {
        premise: {
            name: data.name,
            code: data.code,
            address_unique_id: data.addressUniqueId,
            area_unique_id: data.areaUniqueId,
            location_unique_id: data.locationUniqueId,
            premise_type: data.premiseType,
            floor: data.floor,
            description: data.description,
            access_instructions: data.accessInstructions,
            additional_instructions: data.additionalInstructions,
            notes: data.notes,
            capacity: data.capacity,
            allow_booking_overlap: data.allowBookingOverlap,
            enabled: data.enabled,
            status: data.status,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, premiseMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/premises/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Premise> {
      const response = await transport.put<unknown>(`/premises/${uniqueId}/recover`, {});
      return decodeOne(response, premiseMapper);
    },

    async search(query: string, params?: ListPremisesParams): Promise<PageResult<Premise>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/premises/search', { search: query }, { params: queryParams });
      return decodePageResult(response, premiseMapper);
    },

    async listDeleted(params?: ListPremisesParams): Promise<PageResult<Premise>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/premises/trash/show', { params: queryParams });
      return decodePageResult(response, premiseMapper);
    },
  };
}
