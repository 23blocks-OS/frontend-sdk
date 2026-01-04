import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Group Invite - invitation to join a group
 */
export interface GroupInvite extends IdentityCore {
  groupUniqueId: string;
  code: string;
  inviterUniqueId?: string;
  maxUses?: number;
  usesCount?: number;
  expiresAt?: Date;
  status: EntityStatus;
}

/**
 * Create group invite request
 */
export interface CreateGroupInviteRequest {
  maxUses?: number;
  expiresAt?: string;
}

/**
 * Join group request (using invite code)
 */
export interface JoinGroupRequest {
  userUniqueId?: string;
}

/**
 * QR code response
 */
export interface QRCodeResponse {
  qrCode: string; // base64 encoded image or URL
  inviteUrl: string;
}

/**
 * List group invites params
 */
export interface ListGroupInvitesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
}
