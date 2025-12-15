export interface Cluster {
  id: string;
  uniqueId: string;
  userUniqueId: string;
  code: string;
  name: string;
  description?: string;
  members: ClusterMember[];
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClusterMember {
  entityUniqueId: string;
  role?: string;
  addedAt: Date;
}

export interface CreateClusterRequest {
  code?: string;
  name: string;
  description?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateClusterRequest {
  name?: string;
  description?: string;
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListClustersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ClusterContext {
  id: string;
  uniqueId: string;
  clusterUniqueId: string;
  messages: ClusterMessage[];
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClusterMessage {
  role: string;
  content: string;
  timestamp: Date;
  payload?: Record<string, unknown>;
}

export interface CreateClusterContextRequest {
  systemPrompt?: string;
  payload?: Record<string, unknown>;
}

export interface SendClusterMessageRequest {
  message: string;
  payload?: Record<string, unknown>;
}

export interface SendClusterMessageResponse {
  message: ClusterMessage;
  response?: ClusterMessage;
  tokens?: number;
  cost?: number;
}
