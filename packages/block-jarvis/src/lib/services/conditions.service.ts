import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Condition,
  CreateConditionRequest,
  UpdateConditionRequest,
  ListConditionsParams,
} from '../types/condition.js';
import { conditionMapper } from '../mappers/condition.mapper.js';

function buildConditionBody(data: CreateConditionRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.expressionType) body['expression_type'] = data.expressionType;
  if (data.promptUniqueId) body['prompt_unique_id'] = data.promptUniqueId;
  if (data.llmModel) body['llm_model'] = data.llmModel;
  if (data.llmTemperature !== undefined) body['llm_temperature'] = data.llmTemperature;
  if (data.cacheable !== undefined) body['cacheable'] = data.cacheable;
  if (data.cacheTtlSeconds !== undefined) body['cache_ttl_seconds'] = data.cacheTtlSeconds;
  if (data.expression) body['expression'] = data.expression;
  return body;
}

export interface ConditionsService {
  list(params?: ListConditionsParams): Promise<PageResult<Condition>>;
  get(uniqueId: string): Promise<Condition>;
  create(data: CreateConditionRequest): Promise<Condition>;
  update(uniqueId: string, data: UpdateConditionRequest): Promise<Condition>;
  delete(uniqueId: string): Promise<void>;
}

export function createConditionsService(transport: Transport, _config: { appId: string }): ConditionsService {
  return {
    async list(params?: ListConditionsParams): Promise<PageResult<Condition>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/conditions', { params: queryParams });
      return decodePageResult(response, conditionMapper);
    },

    async get(uniqueId: string): Promise<Condition> {
      const response = await transport.get<unknown>(`/conditions/${uniqueId}`);
      return decodeOne(response, conditionMapper);
    },

    async create(data: CreateConditionRequest): Promise<Condition> {
      const response = await transport.post<unknown>('/conditions', {
        condition: buildConditionBody(data),
      });
      return decodeOne(response, conditionMapper);
    },

    async update(uniqueId: string, data: UpdateConditionRequest): Promise<Condition> {
      const response = await transport.put<unknown>(`/conditions/${uniqueId}`, {
        condition: buildConditionBody(data),
      });
      return decodeOne(response, conditionMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/conditions/${uniqueId}`);
    },
  };
}
