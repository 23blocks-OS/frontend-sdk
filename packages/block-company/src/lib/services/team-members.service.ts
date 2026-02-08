import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  TeamMember,
  AddTeamMemberRequest,
  UpdateTeamMemberRequest,
  ListTeamMembersParams,
} from '../types/team-member.js';
import { teamMemberMapper } from '../mappers/team-member.mapper.js';

export interface TeamMembersService {
  /**
   * List team members with optional filtering and sorting.
   * @returns Paginated list of TeamMember records with metadata.
   */
  list(params?: ListTeamMembersParams): Promise<PageResult<TeamMember>>;

  /**
   * Get a single team member by unique ID.
   * @returns The matching TeamMember record.
   */
  get(uniqueId: string): Promise<TeamMember>;

  /**
   * Add a user as a member of a team.
   * @returns The newly created TeamMember record.
   */
  add(data: AddTeamMemberRequest): Promise<TeamMember>;

  /**
   * Update an existing team member's role or status.
   * @returns The updated TeamMember record.
   */
  update(uniqueId: string, data: UpdateTeamMemberRequest): Promise<TeamMember>;

  /**
   * Remove a member from a team.
   */
  remove(uniqueId: string): Promise<void>;

  /**
   * List all members of a specific team.
   * @returns Array of TeamMember records for the team.
   */
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
