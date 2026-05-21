import type { Transport } from '@23blocks/contracts';
import type {
  AgentRegistration,
  AgentRegistrationResponse,
  RequestAgentRegistrationData,
  ApproveAgentRegistrationData,
  AgentRegistrationStatusRequest,
} from '../types/agent-registration.js';

function parseRegistration(attrs: Record<string, unknown>): AgentRegistration {
  return {
    uniqueId: String(attrs['unique_id'] || ''),
    name: String(attrs['name'] || ''),
    ampAddress: String(attrs['amp_address'] || attrs['address'] || ''),
    ampFingerprint: String(attrs['amp_fingerprint'] || attrs['fingerprint'] || ''),
    ampPublicKey: String(attrs['amp_public_key'] || attrs['public_key'] || ''),
    keyAlgorithm: String(attrs['key_algorithm'] || 'Ed25519'),
    description: attrs['description'] ? String(attrs['description']) : undefined,
    status: (attrs['status'] || 'pending') as AgentRegistration['status'],
    roleId: attrs['role_id'] != null ? Number(attrs['role_id']) : undefined,
    companyUrlId: attrs['company_url_id'] ? String(attrs['company_url_id']) : undefined,
    companyName: attrs['company_name'] ? String(attrs['company_name']) : undefined,
    companyUniqueId: attrs['company_unique_id'] ? String(attrs['company_unique_id']) : undefined,
    createdAt: attrs['created_at'] ? new Date(attrs['created_at'] as string) : undefined,
    updatedAt: attrs['updated_at'] ? new Date(attrs['updated_at'] as string) : undefined,
  };
}

function parseRegistrationResponse(attrs: Record<string, unknown>): AgentRegistrationResponse {
  return {
    ...parseRegistration(attrs),
    authorizationUrl: attrs['authorization_url'] ? String(attrs['authorization_url']) : undefined,
    userCode: attrs['user_code'] ? String(attrs['user_code']) : undefined,
    expiresIn: attrs['expires_in'] != null ? Number(attrs['expires_in']) : undefined,
    interval: attrs['interval'] != null ? Number(attrs['interval']) : undefined,
    tokenEndpoint: attrs['token_endpoint'] ? String(attrs['token_endpoint']) : undefined,
  };
}

function extractAttrs(response: unknown): Record<string, unknown> {
  const doc = response as Record<string, unknown>;
  const data = (doc['data'] || {}) as Record<string, unknown>;
  return (data['attributes'] || data) as Record<string, unknown>;
}

export interface AgentRegistrationsService {
  /**
   * Request agent registration (RFC 8628 device authorization flow).
   * No JWT required — uses API key only. Returns 202 Accepted.
   * Response includes authorizationUrl, userCode, expiresIn, and interval for polling.
   */
  request(data: RequestAgentRegistrationData): Promise<AgentRegistrationResponse>;

  /**
   * Resolve an agent registration by authorization code or user code.
   * @param code - Authorization code or user code (case-insensitive, whitespace-tolerant)
   */
  resolve(code: string): Promise<AgentRegistration>;

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
   * Suspend an approved agent registration (admin JWT required).
   * Blocks token issuance until reactivated.
   * @param uniqueId - Registration unique ID
   */
  suspend(uniqueId: string): Promise<AgentRegistration>;

  /**
   * Reactivate a suspended agent registration (admin JWT required).
   * @param uniqueId - Registration unique ID
   */
  reactivate(uniqueId: string): Promise<AgentRegistration>;

  /**
   * Poll registration status (API key + fingerprint proof, no JWT).
   * @param uniqueId - Registration unique ID
   * @param data - Contains fingerprint for proof of possession
   */
  status(uniqueId: string, data: AgentRegistrationStatusRequest): Promise<AgentRegistration>;
}

export function createAgentRegistrationsService(transport: Transport): AgentRegistrationsService {
  return {
    async request(data: RequestAgentRegistrationData): Promise<AgentRegistrationResponse> {
      const response = await transport.post<unknown>('/agent_registrations/request', {
        agent_registration: {
          name: data.name,
          amp_address: data.ampAddress,
          amp_fingerprint: data.ampFingerprint,
          amp_public_key: data.ampPublicKey,
          key_algorithm: data.keyAlgorithm || 'Ed25519',
          description: data.description,
        },
      });
      return parseRegistrationResponse(extractAttrs(response));
    },

    async resolve(code: string): Promise<AgentRegistration> {
      const response = await transport.get<unknown>('/agent_registrations/resolve', {
        params: { code },
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

    async suspend(uniqueId: string): Promise<AgentRegistration> {
      const response = await transport.post<unknown>(`/agent_registrations/${uniqueId}/suspend`, {});
      return parseRegistration(extractAttrs(response));
    },

    async reactivate(uniqueId: string): Promise<AgentRegistration> {
      const response = await transport.post<unknown>(`/agent_registrations/${uniqueId}/reactivate`, {});
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
