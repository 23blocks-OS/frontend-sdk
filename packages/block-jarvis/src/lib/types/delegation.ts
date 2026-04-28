export interface Delegation {
  id: string;
  uniqueId: string;
  delegatorUniqueId: string;
  delegateUniqueId: string;
  delegationType?: string;
  agentUniqueId?: string;
  contextUniqueId?: string;
  status: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDelegationRequest {
  delegateUniqueId: string;
  delegationType?: string;
  agentUniqueId?: string;
  contextUniqueId?: string;
  expiresAt?: string;
}

export interface UpdateDelegationRequest {
  status?: string;
  expiresAt?: string;
}

export interface ListDelegationsParams {
  page?: number;
  perPage?: number;
  status?: string;
  delegationType?: string;
}
