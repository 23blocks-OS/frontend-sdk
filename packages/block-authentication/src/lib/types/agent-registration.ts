export interface AgentRegistration {
  uniqueId: string;
  name: string;
  ampAddress: string;
  ampFingerprint: string;
  ampPublicKey: string;
  keyAlgorithm: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  roleId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/** RFC 8628 authorization fields — only present in the request() response */
export interface AgentRegistrationResponse extends AgentRegistration {
  /** URL for admin to approve in browser */
  authorizationUrl?: string;
  /** Human-readable code for manual entry (XXXX-XXXX format) */
  userCode?: string;
  /** Seconds until the code expires (default 86400) */
  expiresIn?: number;
  /** Recommended polling interval in seconds (default 5) */
  interval?: number;
}

export interface RequestAgentRegistrationData {
  name: string;
  ampAddress: string;
  ampFingerprint: string;
  ampPublicKey: string;
  keyAlgorithm?: string;
  description?: string;
}

export interface ApproveAgentRegistrationData {
  roleId?: number;
}

export interface AgentRegistrationStatusRequest {
  fingerprint: string;
}
