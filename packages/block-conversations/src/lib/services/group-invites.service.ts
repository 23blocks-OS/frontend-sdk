import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  GroupInvite,
  CreateGroupInviteRequest,
  JoinGroupRequest,
  QRCodeResponse,
  ListGroupInvitesParams,
} from '../types/group-invite.js';
import type { Group } from '../types/group.js';
import { groupInviteMapper } from '../mappers/group-invite.mapper.js';
import { groupMapper } from '../mappers/group.mapper.js';

/**
 * Group Invites Service - manages group invitation links
 */
export interface GroupInvitesService {
  /**
   * List all invites for a group
   * @param groupUniqueId - Unique ID of the group
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of GroupInvite records with pagination metadata
   */
  list(groupUniqueId: string, params?: ListGroupInvitesParams): Promise<PageResult<GroupInvite>>;

  /**
   * Create a new invite for a group
   * @param groupUniqueId - Unique ID of the group to create an invite for
   * @param data - Optional invite configuration including max uses and expiration
   * @returns The newly created GroupInvite record containing the invite code
   */
  create(groupUniqueId: string, data?: CreateGroupInviteRequest): Promise<GroupInvite>;

  /**
   * Revoke an invite
   * @param groupUniqueId - Unique ID of the group the invite belongs to
   * @param code - Invite code to revoke
   * @returns void on successful revocation
   */
  revoke(groupUniqueId: string, code: string): Promise<void>;

  /**
   * Get QR code for an invite
   * @param groupUniqueId - Unique ID of the group the invite belongs to
   * @param code - Invite code to generate a QR code for
   * @returns QRCodeResponse containing the QR code data and invite URL
   */
  getQRCode(groupUniqueId: string, code: string): Promise<QRCodeResponse>;

  /**
   * Join a group using an invite code
   * @param code - Invite code to use for joining
   * @param data - Optional request body with the joining user's unique ID
   * @returns The Group record that was joined
   */
  join(code: string, data?: JoinGroupRequest): Promise<Group>;
}

export function createGroupInvitesService(transport: Transport, _config: { apiKey: string }): GroupInvitesService {
  return {
    async list(groupUniqueId: string, params?: ListGroupInvitesParams): Promise<PageResult<GroupInvite>> {
      assertUuid(groupUniqueId, 'groupUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>(
        `/groups/${groupUniqueId}/invites`,
        { params: queryParams }
      );
      return decodePageResult(response, groupInviteMapper);
    },

    async create(groupUniqueId: string, data?: CreateGroupInviteRequest): Promise<GroupInvite> {
      assertUuid(groupUniqueId, 'groupUniqueId');
      const response = await transport.post<unknown>(`/groups/${groupUniqueId}/invites`, {
        invite: {
          max_uses: data?.maxUses,
          expires_at: data?.expiresAt,
        },
      });
      return decodeOne(response, groupInviteMapper);
    },

    async revoke(groupUniqueId: string, code: string): Promise<void> {
      assertUuid(groupUniqueId, 'groupUniqueId');
      await transport.delete(`/groups/${groupUniqueId}/invites/${code}`);
    },

    async getQRCode(groupUniqueId: string, code: string): Promise<QRCodeResponse> {
      assertUuid(groupUniqueId, 'groupUniqueId');
      const response = await transport.get<unknown>(`/groups/${groupUniqueId}/invites/${code}/qr`);
      // QR code endpoint typically returns the QR data directly
      const data = response as Record<string, unknown>;
      return {
        qrCode: (data.qr_code ?? data.qrCode ?? '') as string,
        inviteUrl: (data.invite_url ?? data.inviteUrl ?? '') as string,
      };
    },

    async join(code: string, data?: JoinGroupRequest): Promise<Group> {
      const response = await transport.post<unknown>(`/groups/join/${code}`, {
        user_unique_id: data?.userUniqueId,
      });
      return decodeOne(response, groupMapper);
    },
  };
}
