import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Quarter,
  CreateQuarterRequest,
  UpdateQuarterRequest,
  ListQuartersParams,
} from '../types/quarter';
import { quarterMapper } from '../mappers/quarter.mapper';

export interface QuartersService {
  list(params?: ListQuartersParams): Promise<PageResult<Quarter>>;
  get(uniqueId: string): Promise<Quarter>;
  create(data: CreateQuarterRequest): Promise<Quarter>;
  update(uniqueId: string, data: UpdateQuarterRequest): Promise<Quarter>;
  delete(uniqueId: string): Promise<void>;
}

export function createQuartersService(transport: Transport, _config: { appId: string }): QuartersService {
  return {
    async list(params?: ListQuartersParams): Promise<PageResult<Quarter>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.companyUniqueId) queryParams['company_unique_id'] = params.companyUniqueId;
      if (params?.year) queryParams['year'] = String(params.year);
      if (params?.quarter) queryParams['quarter'] = String(params.quarter);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/quarters', { params: queryParams });
      return decodePageResult(response, quarterMapper);
    },

    async get(uniqueId: string): Promise<Quarter> {
      const response = await transport.get<unknown>(`/quarters/${uniqueId}`);
      return decodeOne(response, quarterMapper);
    },

    async create(data: CreateQuarterRequest): Promise<Quarter> {
      const response = await transport.post<unknown>('/quarters', {
        data: {
          type: 'Quarter',
          attributes: {
            company_unique_id: data.companyUniqueId,
            name: data.name,
            year: data.year,
            quarter: data.quarter,
            start_date: data.startDate,
            end_date: data.endDate,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, quarterMapper);
    },

    async update(uniqueId: string, data: UpdateQuarterRequest): Promise<Quarter> {
      const response = await transport.put<unknown>(`/quarters/${uniqueId}`, {
        data: {
          type: 'Quarter',
          attributes: {
            name: data.name,
            start_date: data.startDate,
            end_date: data.endDate,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, quarterMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/quarters/${uniqueId}`);
    },
  };
}
