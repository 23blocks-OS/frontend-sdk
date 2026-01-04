import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Position,
  CreatePositionRequest,
  UpdatePositionRequest,
  ListPositionsParams,
} from '../types/position';
import { positionMapper } from '../mappers/position.mapper';

export interface PositionsService {
  list(params?: ListPositionsParams): Promise<PageResult<Position>>;
  get(uniqueId: string): Promise<Position>;
  create(data: CreatePositionRequest): Promise<Position>;
  update(uniqueId: string, data: UpdatePositionRequest): Promise<Position>;
  delete(uniqueId: string): Promise<void>;
  listByDepartment(departmentUniqueId: string): Promise<Position[]>;
}

export function createPositionsService(transport: Transport, _config: { appId: string }): PositionsService {
  return {
    async list(params?: ListPositionsParams): Promise<PageResult<Position>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.departmentUniqueId) queryParams['department_unique_id'] = params.departmentUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/positions', { params: queryParams });
      return decodePageResult(response, positionMapper);
    },

    async get(uniqueId: string): Promise<Position> {
      const response = await transport.get<unknown>(`/positions/${uniqueId}`);
      return decodeOne(response, positionMapper);
    },

    async create(data: CreatePositionRequest): Promise<Position> {
      const response = await transport.post<unknown>('/positions', {
        position: {
          code: data.code,
          name: data.name,
          description: data.description,
          department_unique_id: data.departmentUniqueId,
          level: data.level,
          reports_to_unique_id: data.reportsToUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, positionMapper);
    },

    async update(uniqueId: string, data: UpdatePositionRequest): Promise<Position> {
      const response = await transport.put<unknown>(`/positions/${uniqueId}`, {
        position: {
          name: data.name,
          description: data.description,
          department_unique_id: data.departmentUniqueId,
          level: data.level,
          reports_to_unique_id: data.reportsToUniqueId,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, positionMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/positions/${uniqueId}`);
    },

    async listByDepartment(departmentUniqueId: string): Promise<Position[]> {
      const response = await transport.get<unknown>(`/departments/${departmentUniqueId}/positions`);
      return decodeMany(response, positionMapper);
    },
  };
}
