import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  TeamMember,
  AddTeamMemberRequest,
  UpdateTeamMemberRequest,
  ListTeamMembersParams,
} from '../types/team-member';
import { teamMemberMapper } from '../mappers/team-member.mapper';

export interface TeamMembersService {
  list(params?: ListTeamMembersParams): Promise<PageResult<TeamMember>>;
  get(uniqueId: string): Promise<TeamMember>;
  add(data: AddTeamMemberRequest): Promise<TeamMember>;
  update(uniqueId: string, data: UpdateTeamMemberRequest): Promise<TeamMember>;
  remove(uniqueId: string): Promise<void>;
  listByTeam(teamUniqueId: string): Promise<TeamMember[]>;
}

export function createTeamMembersService(transport: Transport, _config: { appId: string }): TeamMembersService {
  return {
    async list(params?: ListTeamMembersParams): Promise<PageResult<TeamMember>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.teamUniqueId) queryParams['team_unique_id'] = params.teamUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/team_members', { params: queryParams });
      return decodePageResult(response, teamMemberMapper);
    },

    async get(uniqueId: string): Promise<TeamMember> {
      const response = await transport.get<unknown>(`/team_members/${uniqueId}`);
      return decodeOne(response, teamMemberMapper);
    },

    async add(data: AddTeamMemberRequest): Promise<TeamMember> {
      const response = await transport.post<unknown>('/team_members', {
        team_member: {
          team_unique_id: data.teamUniqueId,
          user_unique_id: data.userUniqueId,
          role: data.role,
          payload: data.payload,
        },
      });
      return decodeOne(response, teamMemberMapper);
    },

    async update(uniqueId: string, data: UpdateTeamMemberRequest): Promise<TeamMember> {
      const response = await transport.put<unknown>(`/team_members/${uniqueId}`, {
        team_member: {
          role: data.role,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, teamMemberMapper);
    },

    async remove(uniqueId: string): Promise<void> {
      await transport.delete(`/team_members/${uniqueId}`);
    },

    async listByTeam(teamUniqueId: string): Promise<TeamMember[]> {
      const response = await transport.get<unknown>(`/teams/${teamUniqueId}/members`);
      return decodeMany(response, teamMemberMapper);
    },
  };
}
