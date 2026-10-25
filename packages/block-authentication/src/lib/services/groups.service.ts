import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Group,
  GroupMember,
  CreateGroupRequest,
  UpdateGroupRequest,
  AddGroupMemberRequest,
  GroupInvitation,
  CreateGroupInvitationRequest,
  ListGroupsParams,
} from '../types/index.js';
import { groupMapper, groupMemberMapper, groupInvitationMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Groups service - multi-user groups for shared paid plans.
 *
 * Required scopes: `groups:read`, `groups:write`, `groups:delete`, `groups:admin`.
 * Owners and admin members can manage their own groups without `groups:admin`.
 */
export interface GroupsService {
  /**
   * List groups. Filter by `userId` (member) or `ownerId`;
   * with no filter the `groups:admin` scope is required.
   */
  list(params?: ListGroupsParams): Promise<PageResult<Group>>;

  /**
   * Get a group (with its members) by unique ID
   */
  get(uniqueId: string): Promise<Group>;

  /**
   * Create a group. The owner is added automatically as a member with role `owner`.
   */
  create(request: CreateGroupRequest): Promise<Group>;

  /**
   * Update a group's name or description (owner cannot be changed)
   */
  update(uniqueId: string, request: UpdateGroupRequest): Promise<Group>;

  /**
   * Delete (soft delete) a group
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Add a member to a group
   */
  addMember(groupId: string, request: AddGroupMemberRequest): Promise<GroupMember>;

  /**
   * Remove a member from a group. The group owner cannot be removed.
   */
  removeMember(groupId: string, userUniqueId: string): Promise<void>;

  /**
   * List all groups a user belongs to
   */
  listForUser(userUniqueId: string): Promise<Group[]>;

  /**
   * Invite someone by email (owner or admin). Role defaults to 'member'.
   */
  createInvitation(groupId: string, request: CreateGroupInvitationRequest): Promise<GroupInvitation>;

  /**
   * List a group's pending invitations
   */
  listInvitations(groupId: string): Promise<GroupInvitation[]>;

  /**
   * Revoke a pending invitation
   */
  revokeInvitation(groupId: string, invitationId: string): Promise<void>;

  /**
   * Accept an invitation by token. The signed-in user's email must match the
   * invited email (403 GW-INV-008). Returns the group with its members.
   */
  acceptInvitation(token: string): Promise<Group>;
}

/**
 * Create the groups service
 */
export function createGroupsService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): GroupsService {
  return {
    async list(params?: ListGroupsParams): Promise<PageResult<Group>> {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams['page'] = params.page;
      if (params?.perPage) queryParams['per_page'] = params.perPage;
      if (params?.userId) queryParams['user_id'] = params.userId;
      if (params?.ownerId) queryParams['owner_id'] = params.ownerId;

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/groups',
        { params: queryParams as Record<string, string> }
      );
      return decodePageResult(response, groupMapper);
    },

    async get(uniqueId: string): Promise<Group> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<{ data: unknown }>(`/groups/${uniqueId}`);
      return decodeOne(response, groupMapper);
    },

    async create(request: CreateGroupRequest): Promise<Group> {
      const response = await transport.post<{ data: unknown }>('/groups', {
        group: {
          name: request.name,
          description: request.description,
          owner_user_id: request.ownerUserId,
        },
      });
      return decodeOne(response, groupMapper);
    },

    async update(uniqueId: string, request: UpdateGroupRequest): Promise<Group> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<{ data: unknown }>(`/groups/${uniqueId}`, {
        group: {
          name: request.name,
          description: request.description,
        },
      });
      return decodeOne(response, groupMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/groups/${uniqueId}`);
    },

    async addMember(groupId: string, request: AddGroupMemberRequest): Promise<GroupMember> {
      assertUuid(groupId, 'groupId');
      assertUuid(request.userUniqueId, 'userUniqueId');
      const response = await transport.post<{ data: unknown }>(`/groups/${groupId}/members`, {
        user_unique_id: request.userUniqueId,
        role: request.role,
      });
      return decodeOne(response, groupMemberMapper);
    },

    async removeMember(groupId: string, userUniqueId: string): Promise<void> {
      assertUuid(groupId, 'groupId');
      assertUuid(userUniqueId, 'userUniqueId');
      await transport.delete(`/groups/${groupId}/members/${userUniqueId}`);
    },

    async listForUser(userUniqueId: string): Promise<Group[]> {
      assertUuid(userUniqueId, 'userUniqueId');
      const response = await transport.get<{ data: unknown[] }>(`/users/${userUniqueId}/groups`);
      return decodeMany(response, groupMapper);
    },

    async createInvitation(
      groupId: string,
      request: CreateGroupInvitationRequest
    ): Promise<GroupInvitation> {
      assertUuid(groupId, 'groupId');
      const response = await transport.post<{ data: Record<string, unknown> }>(
        `/groups/${groupId}/invitations`,
        { email: request.email, role: request.role }
      );
      return groupInvitationMapper(response.data);
    },

    async listInvitations(groupId: string): Promise<GroupInvitation[]> {
      assertUuid(groupId, 'groupId');
      const response = await transport.get<{ data?: Record<string, unknown>[] }>(
        `/groups/${groupId}/invitations`
      );
      return (response.data ?? []).map(groupInvitationMapper);
    },

    async revokeInvitation(groupId: string, invitationId: string): Promise<void> {
      assertUuid(groupId, 'groupId');
      assertUuid(invitationId, 'invitationId');
      await transport.delete(`/groups/${groupId}/invitations/${invitationId}`);
    },

    async acceptInvitation(token: string): Promise<Group> {
      const response = await transport.post<{ data: unknown }>(
        `/groups/invitations/${encodeURIComponent(token)}/accept`
      );
      return decodeOne(response, groupMapper);
    },
  };
}
