import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Prompt extends IdentityCore {
  agentUniqueId?: string;
  code: string;
  name: string;
  description?: string;
  template: string;
  variables?: string[];
  version?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreatePromptRequest {
  agentUniqueId?: string;
  code: string;
  name: string;
  description?: string;
  template: string;
  variables?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdatePromptRequest {
  name?: string;
  description?: string;
  template?: string;
  variables?: string[];
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListPromptsParams {
  page?: number;
  perPage?: number;
  agentUniqueId?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ExecutePromptRequest {
  agentUniqueId?: string;
  variables?: Record<string, string>;
  payload?: Record<string, unknown>;
}

export interface ExecutePromptResponse {
  output: string;
  executionUniqueId?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
}

export interface TestPromptRequest {
  template: string;
  variables?: Record<string, string>;
  agentUniqueId?: string;
}

export interface TestPromptResponse {
  renderedPrompt: string;
  isValid: boolean;
  errors?: string[];
}
