import type { Transport } from '@23blocks/contracts';
import type {
  AgentRegistration,
  RequestAgentRegistrationData,
  ApproveAgentRegistrationData,
  AgentRegistrationStatusRequest,
} from '../types/agent-registration.js';

function parseRegistration(attrs: Record<string, unknown>): AgentRegistration {
  return {
    uniqueId: String(attrs['unique_id'] || ''),
    name: String(attrs['name'] || ''),
    address: String(attrs['address'] || ''),
    fingerprint: String(attrs['fingerprint'] || ''),
    publicKey: String(attrs['public_key'] || ''),
    keyAlgorithm: String(attrs['key_algorithm'] || 'Ed25519'),
    description: attrs['description'] ? String(attrs['description']) : undefined,
    status: (attrs['status'] || 'pending') as AgentRegistration['status'],
    roleId: attrs['role_id'] != null ? Number(attrs['role_id']) : undefined,
    createdAt: attrs['created_at'] ? new Date(attrs['created_at'] as string) : undefined,
    updatedAt: attrs['updated_at'] ? new Date(attrs['updated_at'] as string) : undefined,
  };
}

function extractAttrs(response: unknown): Record<string, unknown> {
  const doc = response as Record<string, unknown>;
  const data = (doc['data'] || {}) as Record<string, unknown>;
  return (data['attributes'] || data) as Record<string, unknown>;
}

export interface AgentRegistrationsService {
  /**
   * Request agent registration (no JWT required, API key only).
   * Returns 202 Accepted with status "pending". Idempotent for same fingerprint.
   */
  request(data: RequestAgentRegistrationData): Promise<AgentRegistration>;

  /**
   * Approve a pending agent registration (admin JWT required).
   * @param uniqueId - Registration unique ID
   * @param data - Optional role assignment
   */
  approve(uniqueId: string, data?: ApproveAgentRegistrationData): Promise<AgentRegistration>;

  /**
   * Reject a pending agent registration (admin JWT required).
   * @param uniqueId - Registration unique ID
   */
  reject(uniqueId: string): Promise<AgentRegistration>;

  /**
   * Poll registration status (API key + fingerprint proof, no JWT).
   * @param uniqueId - Registration unique ID
   * @param data - Contains fingerprint for proof of possession
   */
  status(uniqueId: string, data: AgentRegistrationStatusRequest): Promise<AgentRegistration>;
}

export function createAgentRegistrationsService(transport: Transport): AgentRegistrationsService {
  return {
    async request(data: RequestAgentRegistrationData): Promise<AgentRegistration> {
      const response = await transport.post<unknown>('/agent_registrations/request', {
        agent_registration: {
          name: data.name,
          address: data.address,
          fingerprint: data.fingerprint,
          public_key: data.publicKey,
          key_algorithm: data.keyAlgorithm || 'Ed25519',
          description: data.description,
        },
      });
      return parseRegistration(extractAttrs(response));
    },

    async approve(uniqueId: string, data?: ApproveAgentRegistrationData): Promise<AgentRegistration> {
      const body: Record<string, unknown> = {};
      if (data?.roleId) body['role_id'] = data.roleId;
      const response = await transport.post<unknown>(`/agent_registrations/${uniqueId}/approve`, body);
      return parseRegistration(extractAttrs(response));
    },

    async reject(uniqueId: string): Promise<AgentRegistration> {
      const response = await transport.post<unknown>(`/agent_registrations/${uniqueId}/reject`, {});
      return parseRegistration(extractAttrs(response));
    },

    async status(uniqueId: string, data: AgentRegistrationStatusRequest): Promise<AgentRegistration> {
      const response = await transport.post<unknown>(`/agent_registrations/${uniqueId}/status`, {
        fingerprint: data.fingerprint,
      });
      return parseRegistration(extractAttrs(response));
    },
  };
}
