import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Cluster,
  CreateClusterRequest,
  UpdateClusterRequest,
  ListClustersParams,
  ClusterContext,
  CreateClusterContextRequest,
  SendClusterMessageRequest,
  SendClusterMessageResponse,
} from '../types/cluster.js';
import { clusterMapper } from '../mappers/cluster.mapper.js';

export interface ClustersService {
  /**
   * List clusters for a user with optional filtering and sorting.
   * @returns Paginated list of Cluster records with metadata.
   */
  list(userUniqueId: string, params?: ListClustersParams): Promise<PageResult<Cluster>>;

  /**
   * Get a single cluster by unique ID.
   * @returns The matching Cluster record.
   */
  get(userUniqueId: string, uniqueId: string): Promise<Cluster>;

  /**
   * Create a new cluster for a user.
   * @returns The newly created Cluster record.
   */
  create(userUniqueId: string, data: CreateClusterRequest): Promise<Cluster>;

  /**
   * Update an existing cluster.
   * @returns The updated Cluster record.
   */
  update(userUniqueId: string, uniqueId: string, data: UpdateClusterRequest): Promise<Cluster>;

  /**
   * Delete a cluster.
   */
  delete(userUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Add an entity as a member of a cluster.
   */
  addMember(userUniqueId: string, uniqueId: string, entityUniqueId: string): Promise<void>;

  /**
   * Remove an entity from a cluster.
   */
  removeMember(userUniqueId: string, uniqueId: string, entityUniqueId: string): Promise<void>;

  /**
   * Associate a prompt with a cluster.
   */
  addPrompt(userUniqueId: string, uniqueId: string, promptUniqueId: string): Promise<void>;

  /**
   * Get an existing cluster context by unique ID.
   * @returns The ClusterContext with messages and metadata.
   */
  getContext(userUniqueId: string, uniqueId: string, contextUniqueId: string): Promise<ClusterContext>;

  /**
   * Create a new context for cluster conversations.
   * @returns The newly created ClusterContext.
   */
  createContext(userUniqueId: string, uniqueId: string, data?: CreateClusterContextRequest): Promise<ClusterContext>;

  /**
   * Get the conversation history for a cluster context.
   * @returns The ClusterContext with full message history.
   */
  getConversation(userUniqueId: string, uniqueId: string, contextUniqueId: string): Promise<ClusterContext>;

  /**
   * Send a message within a cluster context.
   * @returns SendClusterMessageResponse with the sent message, optional AI response, and cost.
   */
  sendMessage(userUniqueId: string, uniqueId: string, contextUniqueId: string, data: SendClusterMessageRequest): Promise<SendClusterMessageResponse>;
}

export function createClustersService(transport: Transport, _config: { appId: string }): ClustersService {
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
        cluster: {
          code: data.code,
          name: data.name,
          description: data.description,
          payload: data.payload,
        },
      });
      return decodeOne(response, clusterMapper);
    },

    async update(userUniqueId: string, uniqueId: string, data: UpdateClusterRequest): Promise<Cluster> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/clusters/${uniqueId}`, {
        cluster: {
          name: data.name,
          description: data.description,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, clusterMapper);
    },

    async delete(userUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/clusters/${uniqueId}`);
    },

    async addMember(userUniqueId: string, uniqueId: string, entityUniqueId: string): Promise<void> {
      await transport.post(`/users/${userUniqueId}/clusters/${uniqueId}/entities/${entityUniqueId}`, {});
    },

    async removeMember(userUniqueId: string, uniqueId: string, entityUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/clusters/${uniqueId}/entities/${entityUniqueId}`);
    },

    async addPrompt(userUniqueId: string, uniqueId: string, promptUniqueId: string): Promise<void> {
      await transport.post(`/users/${userUniqueId}/clusters/${uniqueId}/prompts`, {
        prompt_unique_id: promptUniqueId,
      });
    },

    async getContext(userUniqueId: string, uniqueId: string, contextUniqueId: string): Promise<ClusterContext> {
      const response = await transport.get<any>(`/users/${userUniqueId}/clusters/${uniqueId}/contexts/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        clusterUniqueId: response.cluster_unique_id,
        messages: (response.messages || []).map((m: any) => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
          payload: m.payload,
        })),
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async createContext(userUniqueId: string, uniqueId: string, data?: CreateClusterContextRequest): Promise<ClusterContext> {
      const response = await transport.post<any>(`/users/${userUniqueId}/clusters/${uniqueId}/contexts`, {
        system_prompt: data?.systemPrompt,
        payload: data?.payload,
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        clusterUniqueId: response.cluster_unique_id,
        messages: [],
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async getConversation(userUniqueId: string, uniqueId: string, contextUniqueId: string): Promise<ClusterContext> {
      const response = await transport.get<any>(`/users/${userUniqueId}/clusters/${uniqueId}/conversations/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        clusterUniqueId: response.cluster_unique_id,
        messages: (response.messages || []).map((m: any) => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
          payload: m.payload,
        })),
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async sendMessage(userUniqueId: string, uniqueId: string, contextUniqueId: string, data: SendClusterMessageRequest): Promise<SendClusterMessageResponse> {
      const response = await transport.post<any>(`/users/${userUniqueId}/clusters/${uniqueId}/contexts/${contextUniqueId}/messages`, {
        message: data.message,
        payload: data.payload,
      });
      return {
        message: {
          role: response.message.role,
          content: response.message.content,
          timestamp: new Date(response.message.timestamp),
          payload: response.message.payload,
        },
        response: response.response ? {
          role: response.response.role,
          content: response.response.content,
          timestamp: new Date(response.response.timestamp),
          payload: response.response.payload,
        } : undefined,
        tokens: response.tokens,
        cost: response.cost,
      };
    },
  };
}
