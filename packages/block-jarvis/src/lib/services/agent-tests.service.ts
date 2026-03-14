import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AgentTest,
  CreateAgentTestRequest,
  UpdateAgentTestRequest,
  ListAgentTestsParams,
  AgentTestResult,
  ListAgentTestResultsParams,
} from '../types/agent-test.js';
import { agentTestMapper, agentTestResultMapper } from '../mappers/agent-test.mapper.js';

function buildAgentTestBody(data: CreateAgentTestRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.input) body['input'] = data.input;
  if (data.expectedOutput) body['expected_output'] = data.expectedOutput;
  if (data.variables) body['variables'] = data.variables;
  if (data.enabled !== undefined) body['enabled'] = data.enabled;
  return body;
}

export interface AgentTestsService {
  list(agentUniqueId: string, params?: ListAgentTestsParams): Promise<PageResult<AgentTest>>;
  get(agentUniqueId: string, testUniqueId: string): Promise<AgentTest>;
  create(agentUniqueId: string, data: CreateAgentTestRequest): Promise<AgentTest>;
  update(agentUniqueId: string, testUniqueId: string, data: UpdateAgentTestRequest): Promise<AgentTest>;
  delete(agentUniqueId: string, testUniqueId: string): Promise<void>;
  run(agentUniqueId: string, testUniqueId: string): Promise<AgentTestResult>;
  runAll(agentUniqueId: string): Promise<AgentTestResult[]>;
  listResults(agentUniqueId: string, testUniqueId: string, params?: ListAgentTestResultsParams): Promise<PageResult<AgentTestResult>>;
  getResult(agentUniqueId: string, testUniqueId: string, resultUniqueId: string): Promise<AgentTestResult>;
  listAgentResults(agentUniqueId: string, params?: ListAgentTestResultsParams): Promise<PageResult<AgentTestResult>>;
}

export function createAgentTestsService(transport: Transport, _config: { apiKey: string }): AgentTestsService {
  return {
    async list(agentUniqueId: string, params?: ListAgentTestsParams): Promise<PageResult<AgentTest>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tests`, { params: queryParams });
      return decodePageResult(response, agentTestMapper);
    },

    async get(agentUniqueId: string, testUniqueId: string): Promise<AgentTest> {
      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tests/${testUniqueId}`);
      return decodeOne(response, agentTestMapper);
    },

    async create(agentUniqueId: string, data: CreateAgentTestRequest): Promise<AgentTest> {
      const response = await transport.post<unknown>(`/agents/${agentUniqueId}/tests`, {
        agent_test: buildAgentTestBody(data),
      });
      return decodeOne(response, agentTestMapper);
    },

    async update(agentUniqueId: string, testUniqueId: string, data: UpdateAgentTestRequest): Promise<AgentTest> {
      const response = await transport.put<unknown>(`/agents/${agentUniqueId}/tests/${testUniqueId}`, {
        agent_test: buildAgentTestBody(data),
      });
      return decodeOne(response, agentTestMapper);
    },

    async delete(agentUniqueId: string, testUniqueId: string): Promise<void> {
      await transport.delete(`/agents/${agentUniqueId}/tests/${testUniqueId}`);
    },

    async run(agentUniqueId: string, testUniqueId: string): Promise<AgentTestResult> {
      const response = await transport.post<unknown>(`/agents/${agentUniqueId}/tests/${testUniqueId}/run`, {});
      return decodeOne(response, agentTestResultMapper);
    },

    async runAll(agentUniqueId: string): Promise<AgentTestResult[]> {
      const response = await transport.post<unknown>(`/agents/${agentUniqueId}/tests/run-all`, {});
      const raw = response as any;
      const data = raw.data || raw;
      if (Array.isArray(data)) {
        return data.map((item: any) => decodeOne({ data: item }, agentTestResultMapper));
      }
      return [];
    },

    async listResults(agentUniqueId: string, testUniqueId: string, params?: ListAgentTestResultsParams): Promise<PageResult<AgentTestResult>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tests/${testUniqueId}/results`, { params: queryParams });
      return decodePageResult(response, agentTestResultMapper);
    },

    async getResult(agentUniqueId: string, testUniqueId: string, resultUniqueId: string): Promise<AgentTestResult> {
      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tests/${testUniqueId}/results/${resultUniqueId}`);
      return decodeOne(response, agentTestResultMapper);
    },

    async listAgentResults(agentUniqueId: string, params?: ListAgentTestResultsParams): Promise<PageResult<AgentTestResult>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/test-results`, { params: queryParams });
      return decodePageResult(response, agentTestResultMapper);
    },
  };
}
