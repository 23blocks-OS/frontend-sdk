export interface AgentRegistration {
  uniqueId: string;
  name: string;
  address: string;
  fingerprint: string;
  publicKey: string;
  keyAlgorithm: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  roleId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RequestAgentRegistrationData {
  name: string;
  address: string;
  fingerprint: string;
  publicKey: string;
  keyAlgorithm?: string;
  description?: string;
}

export interface ApproveAgentRegistrationData {
  roleId?: number;
}

export interface AgentRegistrationStatusRequest {
  fingerprint: string;
}
