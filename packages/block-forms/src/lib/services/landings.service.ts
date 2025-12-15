import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Landing,
  CreateLandingRequest,
  UpdateLandingRequest,
  ListLandingsParams,
} from '../types/landing';
import { landingMapper } from '../mappers/landing.mapper';

export interface LandingsService {
  list(formUniqueId: string, params?: ListLandingsParams): Promise<PageResult<Landing>>;
  get(formUniqueId: string, uniqueId: string): Promise<Landing>;
  create(formUniqueId: string, data: CreateLandingRequest): Promise<Landing>;
  update(formUniqueId: string, uniqueId: string, data: UpdateLandingRequest): Promise<Landing>;
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createLandingsService(transport: Transport, _config: { appId: string }): LandingsService {
  return {
    async list(formUniqueId: string, params?: ListLandingsParams): Promise<PageResult<Landing>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/landings/${formUniqueId}/instances`, { params: queryParams });
      return decodePageResult(response, landingMapper);
    },

    async get(formUniqueId: string, uniqueId: string): Promise<Landing> {
      const response = await transport.get<unknown>(`/landings/${formUniqueId}/instances/${uniqueId}`);
      return decodeOne(response, landingMapper);
    },

    async create(formUniqueId: string, data: CreateLandingRequest): Promise<Landing> {
      const response = await transport.post<unknown>(`/landings/${formUniqueId}/instances`, {
        landing_instance: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          company: data.company,
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, landingMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateLandingRequest): Promise<Landing> {
      const response = await transport.put<unknown>(`/landings/${formUniqueId}/instances/${uniqueId}`, {
        landing_instance: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          company: data.company,
          data: data.data,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, landingMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/landings/${formUniqueId}/instances/${uniqueId}`);
    },
  };
}
