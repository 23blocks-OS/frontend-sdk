import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  GroupInvite,
  CreateGroupInviteRequest,
  JoinGroupRequest,
  QRCodeResponse,
  ListGroupInvitesParams,
} from '../types/group-invite';
import type { Group } from '../types/group';
import { groupInviteMapper } from '../mappers/group-invite.mapper';
import { groupMapper } from '../mappers/group.mapper';

/**
 * Group Invites Service - manages group invitation links
 */
export interface GroupInvitesService {
  /**
   * List all invites for a group
   */
  list(groupUniqueId: string, params?: ListGroupInvitesParams): Promise<PageResult<GroupInvite>>;

  /**
   * Create a new invite for a group
   */
  create(groupUniqueId: string, data?: CreateGroupInviteRequest): Promise<GroupInvite>;

  /**
   * Revoke an invite
   */
  revoke(groupUniqueId: string, code: string): Promise<void>;

  /**
   * Get QR code for an invite
   */
  getQRCode(groupUniqueId: string, code: string): Promise<QRCodeResponse>;

  /**
   * Join a group using an invite code
   */
  join(code: string, data?: JoinGroupRequest): Promise<Group>;
}

export function createGroupInvitesService(transport: Transport, _config: { appId: string }): GroupInvitesService {
  return {
    async list(groupUniqueId: string, params?: ListGroupInvitesParams): Promise<PageResult<GroupInvite>> {
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
      const response = await transport.post<unknown>(`/groups/${groupUniqueId}/invites`, {
        invite: {
          max_uses: data?.maxUses,
          expires_at: data?.expiresAt,
        },
      });
      return decodeOne(response, groupInviteMapper);
    },

    async revoke(groupUniqueId: string, code: string): Promise<void> {
      await transport.delete(`/groups/${groupUniqueId}/invites/${code}`);
    },

    async getQRCode(groupUniqueId: string, code: string): Promise<QRCodeResponse> {
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
