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
} from '../types/form-set';
import { formSetMapper } from '../mappers/form-set.mapper';
import { formInstanceMapper } from '../mappers/form-instance.mapper';
import type { FormInstance } from '../types/form-instance';

export interface FormSetsService {
  /**
   * List all form sets
   */
  list(params?: ListFormSetsParams): Promise<PageResult<FormSet>>;

  /**
   * Get a specific form set
   */
  get(uniqueId: string): Promise<FormSet>;

  /**
   * Create a new form set
   */
  create(data: CreateFormSetRequest): Promise<FormSet>;

  /**
   * Update a form set
   */
  update(uniqueId: string, data: UpdateFormSetRequest): Promise<FormSet>;

  /**
   * Delete a form set
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Match criteria against form sets to find the best match
   */
  match(data: FormSetMatchRequest): Promise<FormSetMatchResult[]>;

  /**
   * Auto-assign forms from a form set to a user
   */
  autoAssign(data: FormSetAutoAssignRequest): Promise<FormInstance[]>;
}

export function createFormSetsService(transport: Transport, _config: { appId: string }): FormSetsService {
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
          forms: data.forms,
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
          forms: data.forms,
          enabled: data.enabled,
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
        criteria: data.criteria,
        user_unique_id: data.userUniqueId,
      });

      // Response is an array of match results
      const results = response as { data: Array<{ form_set: unknown; score: number; matched_criteria: string[] }> };
      return (results.data || []).map((item) => ({
        formSet: formSetMapper.map(item.form_set as { id: string; attributes: Record<string, unknown> }),
        score: item.score,
        matchedCriteria: item.matched_criteria || [],
      }));
    },

    async autoAssign(data: FormSetAutoAssignRequest): Promise<FormInstance[]> {
      const response = await transport.post<unknown>('/form_sets/auto_assign', {
        user_unique_id: data.userUniqueId,
        criteria: data.criteria,
        form_set_unique_id: data.formSetUniqueId,
      });

      const result = decodePageResult(response, formInstanceMapper);
      return result.data;
    },
  };
}
