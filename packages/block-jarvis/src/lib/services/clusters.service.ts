import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Cluster,
  CreateClusterRequest,
  UpdateClusterRequest,
  ListClustersParams,
  CreateContextRequest,
  SendMessageRequest,
} from '../types/cluster.js';
import { clusterMapper } from '../mappers/cluster.mapper.js';
import { buildContextBody, buildMessageBody } from './entities.service.js';

function buildClusterBody(data: CreateClusterRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.reference) body['reference'] = data.reference;
  if (data.description) body['description'] = data.description;
  if (data.userUniqueId) body['user_unique_id'] = data.userUniqueId;
  if (data.abstract) body['abstract'] = data.abstract;
  if (data.keywords) body['keywords'] = data.keywords;
  if (data.content) body['content'] = data.content;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.thumbnailUrl) body['thumbnail_url'] = data.thumbnailUrl;
  if (data.imageUrl) body['image_url'] = data.imageUrl;
  if (data.mediaUrl) body['media_url'] = data.mediaUrl;
  if (data.source) body['source'] = data.source;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.tags) body['tags'] = data.tags;
  if (data.members) body['members'] = data.members;
  if (data.status) body['status'] = data.status;
  return body;
}

export interface ClustersService {
  list(userUniqueId: string, params?: ListClustersParams): Promise<PageResult<Cluster>>;
  get(userUniqueId: string, uniqueId: string): Promise<Cluster>;
  create(userUniqueId: string, data: CreateClusterRequest): Promise<Cluster>;
  update(userUniqueId: string, uniqueId: string, data: UpdateClusterRequest): Promise<Cluster>;
  delete(userUniqueId: string, uniqueId: string): Promise<void>;
  addPrompt(userUniqueId: string, uniqueId: string, promptUniqueId: string): Promise<Cluster>;
  createContext(userUniqueId: string, uniqueId: string, data?: CreateContextRequest): Promise<unknown>;
  sendMessage(userUniqueId: string, uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<unknown>;
}

export function createClustersService(transport: Transport, _config: { apiKey: string }): ClustersService {
  return {
    async list(userUniqueId: string, params?: ListClustersParams): Promise<PageResult<Cluster>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/clusters`, { params: queryParams });
      return decodePageResult(response, clusterMapper);
    },

    async get(userUniqueId: string, uniqueId: string): Promise<Cluster> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/clusters/${uniqueId}`);
      return decodeOne(response, clusterMapper);
    },

    async create(userUniqueId: string, data: CreateClusterRequest): Promise<Cluster> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/clusters`, {
        cluster: buildClusterBody(data),
      });
      return decodeOne(response, clusterMapper);
    },

    async update(userUniqueId: string, uniqueId: string, data: UpdateClusterRequest): Promise<Cluster> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/clusters/${uniqueId}`, {
        cluster: buildClusterBody(data),
      });
      return decodeOne(response, clusterMapper);
    },

    async delete(userUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/clusters/${uniqueId}`);
    },

    async addPrompt(userUniqueId: string, uniqueId: string, promptUniqueId: string): Promise<Cluster> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/clusters/${uniqueId}/prompts`, {
        prompt: { unique_id: promptUniqueId },
      });
      return decodeOne(response, clusterMapper);
    },

    async createContext(userUniqueId: string, uniqueId: string, data?: CreateContextRequest): Promise<unknown> {
      return transport.post<unknown>(`/users/${userUniqueId}/clusters/${uniqueId}/contexts`, data ? {
        context: buildContextBody(data),
      } : {});
    },

    async sendMessage(userUniqueId: string, uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<unknown> {
      return transport.post<unknown>(`/users/${userUniqueId}/clusters/${uniqueId}/contexts/${contextUniqueId}/messages`, {
        message: buildMessageBody(data),
      });
    },
  };
}
