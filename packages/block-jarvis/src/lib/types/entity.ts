export interface Entity {
  id: string;
  uniqueId: string;
  code: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterEntityRequest {
  code?: string;
  name?: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateEntityRequest {
  name?: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListEntitiesParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EntityContext {
  id: string;
  uniqueId: string;
  entityUniqueId: string;
  messages: EntityMessage[];
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityMessage {
  role: string;
  content: string;
  timestamp: Date;
  payload?: Record<string, unknown>;
}

export interface CreateEntityContextRequest {
  systemPrompt?: string;
  payload?: Record<string, unknown>;
}

export interface SendEntityMessageRequest {
  message: string;
  payload?: Record<string, unknown>;
}

export interface SendEntityMessageResponse {
  message: EntityMessage;
  response?: EntityMessage;
  tokens?: number;
  cost?: number;
}

export interface QueryEntityFileRequest {
  query: string;
  payload?: Record<string, unknown>;
}

export interface QueryEntityFileResponse {
  answer: string;
  sources?: string[];
  tokens?: number;
  cost?: number;
}
