import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Tool,
  CreateToolRequest,
  UpdateToolRequest,
  ListToolsParams,
} from '../types/tool.js';
import { toolMapper } from '../mappers/tool.mapper.js';

function buildToolBody(data: CreateToolRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.toolType) body['tool_type'] = data.toolType;
  if (data.apiMethod) body['api_method'] = data.apiMethod;
  if (data.apiUrl) body['api_url'] = data.apiUrl;
  if (data.requiresAuth !== undefined) body['requires_auth'] = data.requiresAuth;
  if (data.responseMapping) body['response_mapping'] = data.responseMapping;
  if (data.parameters) body['parameters'] = data.parameters;
  if (data.apiHeaders) body['api_headers'] = data.apiHeaders;
  if (data.status) body['status'] = data.status;
  if (data.enabled !== undefined) body['enabled'] = data.enabled;
  return body;
}

export interface ToolsService {
  list(params?: ListToolsParams): Promise<PageResult<Tool>>;
  get(uniqueId: string): Promise<Tool>;
  create(data: CreateToolRequest): Promise<Tool>;
  update(uniqueId: string, data: UpdateToolRequest): Promise<Tool>;
  delete(uniqueId: string): Promise<void>;
}

export function createToolsService(transport: Transport, _config: { apiKey: string }): ToolsService {
  return {
    async list(params?: ListToolsParams): Promise<PageResult<Tool>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/tools', { params: queryParams });
      return decodePageResult(response, toolMapper);
    },

    async get(uniqueId: string): Promise<Tool> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/tools/${uniqueId}`);
      return decodeOne(response, toolMapper);
    },

    async create(data: CreateToolRequest): Promise<Tool> {
      const response = await transport.post<unknown>('/tools', {
        tool: buildToolBody(data),
      });
      return decodeOne(response, toolMapper);
    },

    async update(uniqueId: string, data: UpdateToolRequest): Promise<Tool> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/tools/${uniqueId}`, {
        tool: buildToolBody(data),
      });
      return decodeOne(response, toolMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/tools/${uniqueId}`);
    },
  };
}
