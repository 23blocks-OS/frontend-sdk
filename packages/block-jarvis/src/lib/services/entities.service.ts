import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Entity,
  RegisterEntityRequest,
  UpdateEntityRequest,
  ListEntitiesParams,
  EntityContext,
  CreateEntityContextRequest,
  SendEntityMessageRequest,
  SendEntityMessageResponse,
  QueryEntityFileRequest,
  QueryEntityFileResponse,
} from '../types/entity';
import { entityMapper } from '../mappers/entity.mapper';

export interface EntitiesService {
  list(params?: ListEntitiesParams): Promise<PageResult<Entity>>;
  get(uniqueId: string): Promise<Entity>;
  register(uniqueId: string, data?: RegisterEntityRequest): Promise<Entity>;
  update(uniqueId: string, data: UpdateEntityRequest): Promise<Entity>;
  delete(uniqueId: string): Promise<void>;
  addPrompt(uniqueId: string, promptUniqueId: string): Promise<void>;
  getContext(uniqueId: string, contextUniqueId: string): Promise<EntityContext>;
  createContext(uniqueId: string, data?: CreateEntityContextRequest): Promise<EntityContext>;
  getConversation(uniqueId: string, contextUniqueId: string): Promise<EntityContext>;
  sendMessage(uniqueId: string, contextUniqueId: string, data: SendEntityMessageRequest): Promise<SendEntityMessageResponse>;
  queryFile(uniqueId: string, fileUniqueId: string, data: QueryEntityFileRequest): Promise<QueryEntityFileResponse>;
}

export function createEntitiesService(transport: Transport, _config: { appId: string }): EntitiesService {
  return {
    async list(params?: ListEntitiesParams): Promise<PageResult<Entity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/entities', { params: queryParams });
      return decodePageResult(response, entityMapper);
    },

    async get(uniqueId: string): Promise<Entity> {
      const response = await transport.get<unknown>(`/entities/${uniqueId}`);
      return decodeOne(response, entityMapper);
    },

    async register(uniqueId: string, data?: RegisterEntityRequest): Promise<Entity> {
      const response = await transport.post<unknown>(`/entities/${uniqueId}/register`, {
        entity: {
          code: data?.code,
          name: data?.name,
          description: data?.description,
          system_prompt: data?.systemPrompt,
          model: data?.model,
          payload: data?.payload,
        },
      });
      return decodeOne(response, entityMapper);
    },

    async update(uniqueId: string, data: UpdateEntityRequest): Promise<Entity> {
      const response = await transport.put<unknown>(`/entities/${uniqueId}`, {
        entity: {
          name: data.name,
          description: data.description,
          system_prompt: data.systemPrompt,
          model: data.model,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, entityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/entities/${uniqueId}`);
    },

    async addPrompt(uniqueId: string, promptUniqueId: string): Promise<void> {
      await transport.post(`/entities/${uniqueId}/prompts`, {
        prompt_unique_id: promptUniqueId,
      });
    },

    async getContext(uniqueId: string, contextUniqueId: string): Promise<EntityContext> {
      const response = await transport.get<any>(`/entities/${uniqueId}/contexts/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
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

    async createContext(uniqueId: string, data?: CreateEntityContextRequest): Promise<EntityContext> {
      const response = await transport.post<any>(`/entities/${uniqueId}/contexts`, {
        system_prompt: data?.systemPrompt,
        payload: data?.payload,
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
        messages: [],
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async getConversation(uniqueId: string, contextUniqueId: string): Promise<EntityContext> {
      const response = await transport.get<any>(`/entities/${uniqueId}/conversations/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
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

    async sendMessage(uniqueId: string, contextUniqueId: string, data: SendEntityMessageRequest): Promise<SendEntityMessageResponse> {
      const response = await transport.post<any>(`/entities/${uniqueId}/contexts/${contextUniqueId}/messages`, {
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

    async queryFile(uniqueId: string, fileUniqueId: string, data: QueryEntityFileRequest): Promise<QueryEntityFileResponse> {
      const response = await transport.post<any>(`/entities/${uniqueId}/files/${fileUniqueId}/query`, {
        query: data.query,
        payload: data.payload,
      });
      return {
        answer: response.answer,
        sources: response.sources,
        tokens: response.tokens,
        cost: response.cost,
      };
    },
  };
}
