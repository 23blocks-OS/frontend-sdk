import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ExpirationRule,
  CreateExpirationRuleRequest,
  UpdateExpirationRuleRequest,
  ListExpirationRulesParams,
} from '../types/expiration-rule';
import { expirationRuleMapper } from '../mappers/expiration-rule.mapper';

export interface ExpirationRulesService {
  list(params?: ListExpirationRulesParams): Promise<PageResult<ExpirationRule>>;
  get(uniqueId: string): Promise<ExpirationRule>;
  create(data: CreateExpirationRuleRequest): Promise<ExpirationRule>;
  update(uniqueId: string, data: UpdateExpirationRuleRequest): Promise<ExpirationRule>;
  delete(uniqueId: string): Promise<void>;
}

export function createExpirationRulesService(transport: Transport, _config: { appId: string }): ExpirationRulesService {
  return {
    async list(params?: ListExpirationRulesParams): Promise<PageResult<ExpirationRule>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.ruleType) queryParams['rule_type'] = params.ruleType;
      if (params?.isActive !== undefined) queryParams['is_active'] = String(params.isActive);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/expirations', { params: queryParams });
      return decodePageResult(response, expirationRuleMapper);
    },

    async get(uniqueId: string): Promise<ExpirationRule> {
      const response = await transport.get<unknown>(`/expirations/${uniqueId}`);
      return decodeOne(response, expirationRuleMapper);
    },

    async create(data: CreateExpirationRuleRequest): Promise<ExpirationRule> {
      const response = await transport.post<unknown>('/expirations/', {
        expiration_rule: {
          name: data.name,
          description: data.description,
          rule_type: data.ruleType,
          days_to_expire: data.daysToExpire,
          expiration_date: data.expirationDate?.toISOString(),
          warning_days: data.warningDays,
          is_active: data.isActive,
          payload: data.payload,
        },
      });
      return decodeOne(response, expirationRuleMapper);
    },

    async update(uniqueId: string, data: UpdateExpirationRuleRequest): Promise<ExpirationRule> {
      const response = await transport.put<unknown>(`/expirations/${uniqueId}`, {
        expiration_rule: {
          name: data.name,
          description: data.description,
          rule_type: data.ruleType,
          days_to_expire: data.daysToExpire,
          expiration_date: data.expirationDate?.toISOString(),
          warning_days: data.warningDays,
          is_active: data.isActive,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, expirationRuleMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/expirations/${uniqueId}`);
    },
  };
}
