export interface AIModel {
  id: string;
  uniqueId: string;
  code: string;
  name: string;
  provider: string;
  modelId: string;
  description?: string;
  inputTokenCost?: number;
  outputTokenCost?: number;
  maxTokens?: number;
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIModelRequest {
  code: string;
  name: string;
  provider: string;
  modelId: string;
  description?: string;
  inputTokenCost?: number;
  outputTokenCost?: number;
  maxTokens?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateAIModelRequest {
  name?: string;
  description?: string;
  inputTokenCost?: number;
  outputTokenCost?: number;
  maxTokens?: number;
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListAIModelsParams {
  page?: number;
  perPage?: number;
  provider?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
