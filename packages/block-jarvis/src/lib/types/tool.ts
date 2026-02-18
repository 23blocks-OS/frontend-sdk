export interface Tool {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  toolType?: string;
  apiMethod?: string;
  apiUrl?: string;
  requiresAuth?: boolean;
  responseMapping?: string;
  parameters?: Record<string, unknown>;
  apiHeaders?: Record<string, unknown>;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches tool_params in tools_controller.rb */
export interface CreateToolRequest {
  name: string;
  description?: string;
  toolType?: string;
  apiMethod?: string;
  apiUrl?: string;
  requiresAuth?: boolean;
  responseMapping?: string;
  parameters?: Record<string, unknown>;
  apiHeaders?: Record<string, unknown>;
  status?: string;
  enabled?: boolean;
}

export type UpdateToolRequest = CreateToolRequest;

export interface ListToolsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
