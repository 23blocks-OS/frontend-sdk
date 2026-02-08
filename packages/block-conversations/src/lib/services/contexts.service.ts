import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Context,
  CreateContextRequest,
  UpdateContextRequest,
  ListContextsParams,
} from '../types/context.js';
import type { Group } from '../types/group.js';
import { contextMapper } from '../mappers/context.mapper.js';
import { groupMapper } from '../mappers/group.mapper.js';

export interface ContextsService {
  /**
   * List all contexts
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of Context records with pagination metadata
   */
  list(params?: ListContextsParams): Promise<PageResult<Context>>;

  /**
   * Get a context by unique ID
   * @param uniqueId - Unique ID of the context to retrieve
   * @returns The matching Context record
   */
  get(uniqueId: string): Promise<Context>;

  /**
   * Create a new context
   * @param data - Context creation payload including name, type, and metadata
   * @returns The newly created Context record
   */
  create(data: CreateContextRequest): Promise<Context>;

  /**
   * Update a context
   * @param uniqueId - Unique ID of the context to update
   * @param data - Fields to update on the context
   * @returns The updated Context record
   */
  update(uniqueId: string, data: UpdateContextRequest): Promise<Context>;

  /**
   * List groups belonging to a context
   * @param contextUniqueId - Unique ID of the context
   * @returns Paginated list of Group records within the context
   */
  listGroups(contextUniqueId: string): Promise<PageResult<Group>>;
}

export function createContextsService(transport: Transport, _config: { appId: string }): ContextsService {
  return {
    async list(params?: ListContextsParams): Promise<PageResult<Context>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.contextType) queryParams['context_type'] = params.contextType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/contexts', { params: queryParams });
      return decodePageResult(response, contextMapper);
    },

    async get(uniqueId: string): Promise<Context> {
      const response = await transport.get<unknown>(`/contexts/${uniqueId}`);
      return decodeOne(response, contextMapper);
    },

    async create(data: CreateContextRequest): Promise<Context> {
      const response = await transport.post<unknown>('/contexts', {
        context: {
          name: data.name,
          description: data.description,
          context_type: data.contextType,
          metadata: data.metadata,
          payload: data.payload,
        },
      });
      return decodeOne(response, contextMapper);
    },

    async update(uniqueId: string, data: UpdateContextRequest): Promise<Context> {
      const response = await transport.put<unknown>(`/contexts/${uniqueId}`, {
        context: {
          name: data.name,
          description: data.description,
          context_type: data.contextType,
          status: data.status,
          metadata: data.metadata,
          payload: data.payload,
        },
      });
      return decodeOne(response, contextMapper);
    },

    async listGroups(contextUniqueId: string): Promise<PageResult<Group>> {
      const response = await transport.get<unknown>(`/context/${contextUniqueId}/groups`);
      return decodePageResult(response, groupMapper);
    },
  };
}
