import type { IdentityCore } from '@23blocks/contracts';

/**
 * Role of a user within a group
 */
export type GroupRole = 'owner' | 'admin' | 'member';

/**
 * Group lifecycle status
 */
export type GroupStatus = 'active' | 'suspended' | 'deleted';

/**
 * Group entity - multi-user membership for shared paid plans.
 *
 * A group has one owner (the purchaser), optional admins, and members.
 */
export interface Group extends IdentityCore {
  name: string;
  description: string | null;
  /** Unique ID of the user who owns (purchased) the group */
  ownerUserId: string;
  status: GroupStatus;
  memberCount: number;

  /** Members, present when the API includes them (e.g. `get`) */
  members?: GroupMember[];
}

/**
 * Membership of a user in a group
 */
export interface GroupMember {
  id: string;
  /** Unique ID of the member user */
  userUniqueId: string;
  role: GroupRole;
  status: GroupStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create group request
 */
export interface CreateGroupRequest {
  name: string;
  description?: string;
  /** Defaults to the current user when omitted */
  ownerUserId?: string;
}

/**
 * Update group request (owner cannot be changed)
 */
export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

/**
 * Add member request
 */
export interface AddGroupMemberRequest {
  userUniqueId: string;
  /** Defaults to 'member' */
  role?: GroupRole;
}

/**
 * Invitation role (owner cannot be invited)
 */
export type GroupInvitationRole = 'admin' | 'member';

/**
 * Pending invitation to join a group
 */
export interface GroupInvitation {
  id: string;
  email: string;
  role: GroupInvitationRole;
  expiresAt: Date;
  /** Unique ID of the inviting user (only returned when listing) */
  invitedBy: string | null;
}

/**
 * Create group invitation request
 */
export interface CreateGroupInvitationRequest {
  email: string;
  /** Defaults to 'member' */
  role?: GroupInvitationRole;
}

/**
 * List groups filters. Without a filter, the `groups:admin` scope is required.
 */
export interface ListGroupsParams {
  page?: number;
  perPage?: number;
  /** Only groups the given user belongs to */
  userId?: string;
  /** Only groups owned by the given user */
  ownerId?: string;
}

/**
 * Optional group claims added to access tokens for users that belong to groups.
 * Absent for users without groups.
 */
export interface GroupJwtClaims {
  /** Primary group (first active group) */
  group_id?: string;
  /** Owner of the primary group (the purchaser) */
  group_owner_id?: string;
  /** The user's role in the primary group */
  group_role?: GroupRole;
  /** All groups the user belongs to */
  group_ids?: string[];
}

/**
 * Access token payload, including optional group claims
 */
export interface AccessTokenPayload extends GroupJwtClaims {
  iss?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  scopes?: string[];
  user_unique_id?: string;
  user_role_id?: string;
  [claim: string]: unknown;
}
