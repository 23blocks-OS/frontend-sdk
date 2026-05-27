import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PromptTest,
  CreatePromptTestRequest,
  UpdatePromptTestRequest,
  ListPromptTestsParams,
  PromptTestResult,
  ListPromptTestResultsParams,
  PromptTestEvaluation,
  CreatePromptTestEvaluationRequest,
  CompareVersionsRequest,
  CompareVersionsResponse,
} from '../types/prompt-test.js';
import { promptTestMapper, promptTestResultMapper, promptTestEvaluationMapper } from '../mappers/prompt-test.mapper.js';

function buildPromptTestBody(data: CreatePromptTestRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.input) body['input'] = data.input;
  if (data.expectedOutput) body['expected_output'] = data.expectedOutput;
  if (data.variables) body['variables'] = data.variables;
  if (data.enabled !== undefined) body['enabled'] = data.enabled;
  return body;
}

export interface PromptTestsService {
  list(promptUniqueId: string, params?: ListPromptTestsParams): Promise<PageResult<PromptTest>>;
  get(promptUniqueId: string, testUniqueId: string): Promise<PromptTest>;
  create(promptUniqueId: string, data: CreatePromptTestRequest): Promise<PromptTest>;
  update(promptUniqueId: string, testUniqueId: string, data: UpdatePromptTestRequest): Promise<PromptTest>;
  delete(promptUniqueId: string, testUniqueId: string): Promise<void>;
  run(promptUniqueId: string, testUniqueId: string): Promise<PromptTestResult>;
  runAgainstVersion(promptUniqueId: string, versionUniqueId: string, testUniqueId: string): Promise<PromptTestResult>;
  runAll(promptUniqueId: string): Promise<PromptTestResult[]>;
  listResults(promptUniqueId: string, testUniqueId: string, params?: ListPromptTestResultsParams): Promise<PageResult<PromptTestResult>>;
  getResult(promptUniqueId: string, testUniqueId: string, resultUniqueId: string): Promise<PromptTestResult>;
  listVersionResults(promptUniqueId: string, versionUniqueId: string, params?: ListPromptTestResultsParams): Promise<PageResult<PromptTestResult>>;
}

export function createPromptTestsService(transport: Transport, _config: { apiKey: string }): PromptTestsService {
  return {
    async list(promptUniqueId: string, params?: ListPromptTestsParams): Promise<PageResult<PromptTest>> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/tests`, { params: queryParams });
      return decodePageResult(response, promptTestMapper);
    },

    async get(promptUniqueId: string, testUniqueId: string): Promise<PromptTest> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(testUniqueId, 'testUniqueId');
      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/tests/${testUniqueId}`);
      return decodeOne(response, promptTestMapper);
    },

    async create(promptUniqueId: string, data: CreatePromptTestRequest): Promise<PromptTest> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/tests`, {
        prompt_test: buildPromptTestBody(data),
      });
      return decodeOne(response, promptTestMapper);
    },

    async update(promptUniqueId: string, testUniqueId: string, data: UpdatePromptTestRequest): Promise<PromptTest> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(testUniqueId, 'testUniqueId');
      const response = await transport.put<unknown>(`/prompts/${promptUniqueId}/tests/${testUniqueId}`, {
        prompt_test: buildPromptTestBody(data),
      });
      return decodeOne(response, promptTestMapper);
    },

    async delete(promptUniqueId: string, testUniqueId: string): Promise<void> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(testUniqueId, 'testUniqueId');
      await transport.delete(`/prompts/${promptUniqueId}/tests/${testUniqueId}`);
    },

    async run(promptUniqueId: string, testUniqueId: string): Promise<PromptTestResult> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(testUniqueId, 'testUniqueId');
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/tests/${testUniqueId}/run`, {});
      return decodeOne(response, promptTestResultMapper);
    },

    async runAgainstVersion(promptUniqueId: string, versionUniqueId: string, testUniqueId: string): Promise<PromptTestResult> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(versionUniqueId, 'versionUniqueId');
      assertUuid(testUniqueId, 'testUniqueId');
      const response = await transport.post<unknown>(
        `/prompts/${promptUniqueId}/versions/${versionUniqueId}/tests/${testUniqueId}/run`, {}
      );
      return decodeOne(response, promptTestResultMapper);
    },

    async runAll(promptUniqueId: string): Promise<PromptTestResult[]> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      const response = await transport.post<unknown>(`/prompts/${promptUniqueId}/tests/run-all`, {});
      const raw = response as any;
      const data = raw.data || raw;
      if (Array.isArray(data)) {
        return data.map((item: any) => decodeOne({ data: item }, promptTestResultMapper));
      }
      return [];
    },

    async listResults(promptUniqueId: string, testUniqueId: string, params?: ListPromptTestResultsParams): Promise<PageResult<PromptTestResult>> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(testUniqueId, 'testUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/tests/${testUniqueId}/results`, { params: queryParams });
      return decodePageResult(response, promptTestResultMapper);
    },

    async getResult(promptUniqueId: string, testUniqueId: string, resultUniqueId: string): Promise<PromptTestResult> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(testUniqueId, 'testUniqueId');
      assertUuid(resultUniqueId, 'resultUniqueId');
      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/tests/${testUniqueId}/results/${resultUniqueId}`);
      return decodeOne(response, promptTestResultMapper);
    },

    async listVersionResults(promptUniqueId: string, versionUniqueId: string, params?: ListPromptTestResultsParams): Promise<PageResult<PromptTestResult>> {
      assertUuid(promptUniqueId, 'promptUniqueId');
      assertUuid(versionUniqueId, 'versionUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/versions/${versionUniqueId}/test-results`, { params: queryParams });
      return decodePageResult(response, promptTestResultMapper);
    },
  };
}

export interface PromptTestEvaluationsService {
  list(params?: { page?: number; perPage?: number }): Promise<PageResult<PromptTestEvaluation>>;
  get(uniqueId: string): Promise<PromptTestEvaluation>;
  create(data: CreatePromptTestEvaluationRequest): Promise<PromptTestEvaluation>;
  run(uniqueId: string): Promise<PromptTestEvaluation>;
  compareVersions(data: CompareVersionsRequest): Promise<CompareVersionsResponse>;
}

export function createPromptTestEvaluationsService(transport: Transport, _config: { apiKey: string }): PromptTestEvaluationsService {
  return {
    async list(params?: { page?: number; perPage?: number }): Promise<PageResult<PromptTestEvaluation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/prompt-test-evaluations', { params: queryParams });
      return decodePageResult(response, promptTestEvaluationMapper);
    },

    async get(uniqueId: string): Promise<PromptTestEvaluation> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/prompt-test-evaluations/${uniqueId}`);
      return decodeOne(response, promptTestEvaluationMapper);
    },

    async create(data: CreatePromptTestEvaluationRequest): Promise<PromptTestEvaluation> {
      const response = await transport.post<unknown>('/prompt-test-evaluations', {
        prompt_test_evaluation: data,
      });
      return decodeOne(response, promptTestEvaluationMapper);
    },

    async run(uniqueId: string): Promise<PromptTestEvaluation> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/prompt-test-evaluations/${uniqueId}/run`, {});
      return decodeOne(response, promptTestEvaluationMapper);
    },

    async compareVersions(data: CompareVersionsRequest): Promise<CompareVersionsResponse> {
      const response = await transport.post<any>('/prompt-test-evaluations/compare-versions', {
        version_a: data.versionA,
        version_b: data.versionB,
      });
      return {
        versionA: response.version_a || data.versionA,
        versionB: response.version_b || data.versionB,
        results: response.results || [],
      };
    },
  };
}
