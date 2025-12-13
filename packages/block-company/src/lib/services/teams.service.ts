import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  ListTeamsParams,
} from '../types/team';
import { teamMapper } from '../mappers/team.mapper';

export interface TeamsService {
  list(params?: ListTeamsParams): Promise<PageResult<Team>>;
  get(uniqueId: string): Promise<Team>;
  create(data: CreateTeamRequest): Promise<Team>;
  update(uniqueId: string, data: UpdateTeamRequest): Promise<Team>;
  delete(uniqueId: string): Promise<void>;
  listByDepartment(departmentUniqueId: string): Promise<Team[]>;
}

export function createTeamsService(transport: Transport, _config: { appId: string }): TeamsService {
  return {
    async list(params?: ListTeamsParams): Promise<PageResult<Team>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.departmentUniqueId) queryParams['department_unique_id'] = params.departmentUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/teams', { params: queryParams });
      return decodePageResult(response, teamMapper);
    },

    async get(uniqueId: string): Promise<Team> {
      const response = await transport.get<unknown>(`/teams/${uniqueId}`);
      return decodeOne(response, teamMapper);
    },

    async create(data: CreateTeamRequest): Promise<Team> {
      const response = await transport.post<unknown>('/teams', {
        data: {
          type: 'Team',
          attributes: {
            department_unique_id: data.departmentUniqueId,
            code: data.code,
            name: data.name,
            description: data.description,
            leader_unique_id: data.leaderUniqueId,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, teamMapper);
    },

    async update(uniqueId: string, data: UpdateTeamRequest): Promise<Team> {
      const response = await transport.put<unknown>(`/teams/${uniqueId}`, {
        data: {
          type: 'Team',
          attributes: {
            name: data.name,
            description: data.description,
            leader_unique_id: data.leaderUniqueId,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, teamMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/teams/${uniqueId}`);
    },

    async listByDepartment(departmentUniqueId: string): Promise<Team[]> {
      const response = await transport.get<unknown>(`/departments/${departmentUniqueId}/teams`);
      return decodeMany(response, teamMapper);
    },
  };
}
