import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  JarvisUser,
  RegisterJarvisUserRequest,
  UpdateJarvisUserRequest,
  ListJarvisUsersParams,
  UserContext,
  CreateUserContextRequest,
  SendUserMessageRequest,
  SendUserMessageResponse,
  CreateUserContentContextRequest,
} from '../types/user.js';
import { jarvisUserMapper } from '../mappers/user.mapper.js';

export interface JarvisUsersService {
  /**
   * List Jarvis users with optional filtering and sorting.
   * @returns Paginated list of JarvisUser records with metadata.
   */
  list(params?: ListJarvisUsersParams): Promise<PageResult<JarvisUser>>;

  /**
   * Get a single Jarvis user by unique ID.
   * @returns The matching JarvisUser record.
   */
  get(uniqueId: string): Promise<JarvisUser>;

  /**
   * Register a user in the Jarvis system.
   * @returns The newly registered JarvisUser record.
   */
  register(uniqueId: string, data?: RegisterJarvisUserRequest): Promise<JarvisUser>;

  /**
   * Update a Jarvis user.
   * @returns The updated JarvisUser record.
   */
  update(uniqueId: string, data: UpdateJarvisUserRequest): Promise<JarvisUser>;

  /**
   * Associate a prompt with a user.
   */
  addPrompt(uniqueId: string, promptUniqueId: string): Promise<void>;

  /**
   * Get an existing user context by unique ID.
   * @returns The UserContext with messages and metadata.
   */
  getContext(uniqueId: string, contextUniqueId: string): Promise<UserContext>;

  /**
   * Create a new context for user conversations.
   * @returns The newly created UserContext.
   */
  createContext(uniqueId: string, data?: CreateUserContextRequest): Promise<UserContext>;

  /**
   * Get the conversation history for a user context.
   * @returns The UserContext with full message history.
   */
  getConversation(uniqueId: string, contextUniqueId: string): Promise<UserContext>;

  /**
   * Send a message within a user context.
   * @returns SendUserMessageResponse with the sent message, optional AI response, and cost.
   */
  sendMessage(uniqueId: string, contextUniqueId: string, data: SendUserMessageRequest): Promise<SendUserMessageResponse>;

  /**
   * Get an existing content-scoped context for a user.
   * @returns The UserContext with messages and metadata.
   */
  getContentContext(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string): Promise<UserContext>;

  /**
   * Create a new content-scoped context for a user.
   * @returns The newly created UserContext.
   */
  createContentContext(uniqueId: string, contentIdentityUniqueId: string, data?: CreateUserContentContextRequest): Promise<UserContext>;

  /**
   * Get the content-scoped conversation history for a user.
   * @returns The UserContext with full message history.
   */
  getContentConversation(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string): Promise<UserContext>;

  /**
   * Send a message within a content-scoped user context.
   * @returns SendUserMessageResponse with the sent message, optional AI response, and cost.
   */
  sendContentMessage(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string, data: SendUserMessageRequest): Promise<SendUserMessageResponse>;
}

export function createJarvisUsersService(transport: Transport, _config: { appId: string }): JarvisUsersService {
  return {
    async list(params?: ListJarvisUsersParams): Promise<PageResult<JarvisUser>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/identities', { params: queryParams });
      return decodePageResult(response, jarvisUserMapper);
    },

    async get(uniqueId: string): Promise<JarvisUser> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}`);
      return decodeOne(response, jarvisUserMapper);
    },

    async register(uniqueId: string, data?: RegisterJarvisUserRequest): Promise<JarvisUser> {
      const response = await transport.post<unknown>(`/identities/${uniqueId}/register`, {
        user: {
          email: data?.email,
          name: data?.name,
          username: data?.username,
          avatar_url: data?.avatarUrl,
          payload: data?.payload,
        },
      });
      return decodeOne(response, jarvisUserMapper);
    },

    async update(uniqueId: string, data: UpdateJarvisUserRequest): Promise<JarvisUser> {
      const response = await transport.put<unknown>(`/identities/${uniqueId}`, {
        user: {
          name: data.name,
          username: data.username,
          avatar_url: data.avatarUrl,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, jarvisUserMapper);
    },

    async addPrompt(uniqueId: string, promptUniqueId: string): Promise<void> {
      await transport.post(`/identities/${uniqueId}/prompts`, {
        prompt_unique_id: promptUniqueId,
      });
    },

    async getContext(uniqueId: string, contextUniqueId: string): Promise<UserContext> {
      const response = await transport.get<any>(`/identities/${uniqueId}/contexts/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
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

    async createContext(uniqueId: string, data?: CreateUserContextRequest): Promise<UserContext> {
      const response = await transport.post<any>(`/identities/${uniqueId}/contexts`, {
        system_prompt: data?.systemPrompt,
        payload: data?.payload,
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
        messages: [],
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async getConversation(uniqueId: string, contextUniqueId: string): Promise<UserContext> {
      const response = await transport.get<any>(`/identities/${uniqueId}/conversations/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
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

    async sendMessage(uniqueId: string, contextUniqueId: string, data: SendUserMessageRequest): Promise<SendUserMessageResponse> {
      const response = await transport.post<any>(`/identities/${uniqueId}/contexts/${contextUniqueId}/messages`, {
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

    async getContentContext(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string): Promise<UserContext> {
      const response = await transport.get<any>(`/identities/${uniqueId}/content/${contentIdentityUniqueId}/context/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
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

    async createContentContext(uniqueId: string, contentIdentityUniqueId: string, data?: CreateUserContentContextRequest): Promise<UserContext> {
      const response = await transport.post<any>(`/identities/${uniqueId}/content/${contentIdentityUniqueId}/context`, {
        system_prompt: data?.systemPrompt,
        payload: data?.payload,
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
        messages: [],
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async getContentConversation(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string): Promise<UserContext> {
      const response = await transport.get<any>(`/identities/${uniqueId}/content/${contentIdentityUniqueId}/conversations/${contextUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
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

    async sendContentMessage(uniqueId: string, contentIdentityUniqueId: string, contextUniqueId: string, data: SendUserMessageRequest): Promise<SendUserMessageResponse> {
      const response = await transport.post<any>(`/identities/${uniqueId}/content/${contentIdentityUniqueId}/contexts/${contextUniqueId}/messages`, {
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
