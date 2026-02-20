import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FormSet,
  CreateFormSetRequest,
  UpdateFormSetRequest,
  ListFormSetsParams,
  FormSetMatchRequest,
  FormSetMatchResult,
  FormSetAutoAssignRequest,
} from '../types/form-set.js';
import { formSetMapper } from '../mappers/form-set.mapper.js';
import { formInstanceMapper } from '../mappers/form-instance.mapper.js';
import type { FormInstance } from '../types/form-instance.js';

export interface FormSetsService {
  list(params?: ListFormSetsParams): Promise<PageResult<FormSet>>;
  get(uniqueId: string): Promise<FormSet>;
  create(data: CreateFormSetRequest): Promise<FormSet>;
  update(uniqueId: string, data: UpdateFormSetRequest): Promise<FormSet>;
  delete(uniqueId: string): Promise<void>;
  match(data: FormSetMatchRequest): Promise<FormSetMatchResult[]>;
  autoAssign(data: FormSetAutoAssignRequest): Promise<FormInstance[]>;
}

export function createFormSetsService(transport: Transport, _config: { apiKey: string }): FormSetsService {
  return {
    async list(params?: ListFormSetsParams): Promise<PageResult<FormSet>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/form_sets', { params: queryParams });
      return decodePageResult(response, formSetMapper);
    },

    async get(uniqueId: string): Promise<FormSet> {
      const response = await transport.get<unknown>(`/form_sets/${uniqueId}`);
      return decodeOne(response, formSetMapper);
    },

    async create(data: CreateFormSetRequest): Promise<FormSet> {
      const response = await transport.post<unknown>('/form_sets', {
        form_set: {
          code: data.code,
          name: data.name,
          description: data.description,
          category: data.category,
          applies_to: data.appliesTo,
          is_active: data.isActive,
          is_default: data.isDefault,
          send_all_at_once: data.sendAllAtOnce,
          allow_partial_completion: data.allowPartialCompletion,
          enforce_sequential: data.enforceSequential,
          expiration_days: data.expirationDays,
          auto_assign_rules: data.autoAssignRules,
          metadata: data.metadata,
          form_set_items_attributes: data.formSetItemsAttributes?.map((item) => ({
            form_schema_unique_id: item.formSchemaUniqueId,
            display_order: item.displayOrder,
            required: item.required,
          })),
          payload: data.payload,
        },
      });
      return decodeOne(response, formSetMapper);
    },

    async update(uniqueId: string, data: UpdateFormSetRequest): Promise<FormSet> {
      const response = await transport.put<unknown>(`/form_sets/${uniqueId}`, {
        form_set: {
          name: data.name,
          description: data.description,
          category: data.category,
          applies_to: data.appliesTo,
          is_active: data.isActive,
          is_default: data.isDefault,
          send_all_at_once: data.sendAllAtOnce,
          allow_partial_completion: data.allowPartialCompletion,
          enforce_sequential: data.enforceSequential,
          expiration_days: data.expirationDays,
          auto_assign_rules: data.autoAssignRules,
          metadata: data.metadata,
          form_set_items_attributes: data.formSetItemsAttributes?.map((item) => ({
            form_schema_unique_id: item.formSchemaUniqueId,
            display_order: item.displayOrder,
            required: item.required,
          })),
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, formSetMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/form_sets/${uniqueId}`);
    },

    async match(data: FormSetMatchRequest): Promise<FormSetMatchResult[]> {
      const response = await transport.post<unknown>('/form_sets/match', {
        context: {
          user_unique_id: data.userUniqueId,
          form_set_unique_id: data.formSetUniqueId,
          category: data.category,
          applies_to: data.appliesTo,
          metadata: data.metadata,
        },
      });

      const results = response as { data: Array<{ form_set: unknown; score: number; matched_criteria: string[] }> };
      return (results.data || []).map((item) => ({
        formSet: formSetMapper.map(item.form_set as any, new Map()),
        score: item.score,
        matchedCriteria: item.matched_criteria || [],
      }));
    },

    async autoAssign(data: FormSetAutoAssignRequest): Promise<FormInstance[]> {
      const response = await transport.post<unknown>('/form_sets/auto_assign', {
        assignment: {
          user_unique_id: data.userUniqueId,
          form_set_unique_id: data.formSetUniqueId,
          assigned_by_name: data.assignedByName,
          expires_at: data.expiresAt instanceof Date ? data.expiresAt.toISOString() : data.expiresAt,
          metadata: data.metadata,
        },
      });

      const result = decodePageResult(response, formInstanceMapper);
      return result.data;
    },
  };
}
