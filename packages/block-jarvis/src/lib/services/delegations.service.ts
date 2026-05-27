import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Delegation,
  CreateDelegationRequest,
  UpdateDelegationRequest,
  ListDelegationsParams,
} from '../types/delegation.js';
import { delegationMapper } from '../mappers/delegation.mapper.js';

export interface DelegationsService {
  /** List delegations granted by a user identity. */
  list(identityUniqueId: string, params?: ListDelegationsParams): Promise<PageResult<Delegation>>;
  /** Get a specific delegation. */
  get(identityUniqueId: string, delegationUniqueId: string): Promise<Delegation>;
  /** Create a new delegation for a user identity. */
  create(identityUniqueId: string, data: CreateDelegationRequest): Promise<Delegation>;
  /** Update an existing delegation. */
  update(identityUniqueId: string, delegationUniqueId: string, data: UpdateDelegationRequest): Promise<Delegation>;
  /** Revoke (delete) a delegation. */
  revoke(identityUniqueId: string, delegationUniqueId: string): Promise<void>;
}

export function createDelegationsService(transport: Transport, _config: { apiKey: string }): DelegationsService {
  return {
    async list(identityUniqueId: string, params?: ListDelegationsParams): Promise<PageResult<Delegation>> {
      assertUuid(identityUniqueId, 'identityUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.delegationType) queryParams['delegation_type'] = params.delegationType;

      const response = await transport.get<unknown>(`/identities/${identityUniqueId}/delegations`, { params: queryParams });
      return decodePageResult(response, delegationMapper);
    },

    async get(identityUniqueId: string, delegationUniqueId: string): Promise<Delegation> {
      assertUuid(identityUniqueId, 'identityUniqueId');
      assertUuid(delegationUniqueId, 'delegationUniqueId');
      const response = await transport.get<unknown>(`/identities/${identityUniqueId}/delegations/${delegationUniqueId}`);
      return decodeOne(response, delegationMapper);
    },

    async create(identityUniqueId: string, data: CreateDelegationRequest): Promise<Delegation> {
      assertUuid(identityUniqueId, 'identityUniqueId');
      const body: Record<string, unknown> = {};
      body['delegate_unique_id'] = data.delegateUniqueId;
      if (data.delegationType) body['delegation_type'] = data.delegationType;
      if (data.agentUniqueId) body['agent_unique_id'] = data.agentUniqueId;
      if (data.contextUniqueId) body['context_unique_id'] = data.contextUniqueId;
      if (data.expiresAt) body['expires_at'] = data.expiresAt;

      const response = await transport.post<unknown>(`/identities/${identityUniqueId}/delegations`, {
        delegation: body,
      });
      return decodeOne(response, delegationMapper);
    },

    async update(identityUniqueId: string, delegationUniqueId: string, data: UpdateDelegationRequest): Promise<Delegation> {
      assertUuid(identityUniqueId, 'identityUniqueId');
      assertUuid(delegationUniqueId, 'delegationUniqueId');
      const body: Record<string, unknown> = {};
      if (data.status) body['status'] = data.status;
      if (data.expiresAt) body['expires_at'] = data.expiresAt;

      const response = await transport.put<unknown>(`/identities/${identityUniqueId}/delegations/${delegationUniqueId}`, {
        delegation: body,
      });
      return decodeOne(response, delegationMapper);
    },

    async revoke(identityUniqueId: string, delegationUniqueId: string): Promise<void> {
      assertUuid(identityUniqueId, 'identityUniqueId');
      assertUuid(delegationUniqueId, 'delegationUniqueId');
      await transport.delete(`/identities/${identityUniqueId}/delegations/${delegationUniqueId}`);
    },
  };
}
