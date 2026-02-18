import type { CreateContextRequest, SendMessageRequest } from './entity.js';

export interface Cluster {
  id: string;
  uniqueId: string;
  name: string;
  reference?: string;
  description?: string;
  userUniqueId?: string;
  abstract?: string;
  keywords?: string;
  content?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  tags?: string;
  members?: string;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches cluster_params in clusters_controller.rb */
export interface CreateClusterRequest {
  name: string;
  reference?: string;
  description?: string;
  userUniqueId?: string;
  abstract?: string;
  keywords?: string;
  content?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  tags?: string;
  members?: string;
  status?: string;
}

export type UpdateClusterRequest = CreateClusterRequest;

export interface ListClustersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type { CreateContextRequest, SendMessageRequest };
