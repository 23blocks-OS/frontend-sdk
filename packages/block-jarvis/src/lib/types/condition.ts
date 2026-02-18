export interface Condition {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  expressionType?: string;
  promptUniqueId?: string;
  llmModel?: string;
  llmTemperature?: number;
  cacheable?: boolean;
  cacheTtlSeconds?: number;
  expression?: Record<string, unknown>;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches condition_params in conditions_controller.rb */
export interface CreateConditionRequest {
  name: string;
  description?: string;
  expressionType?: string;
  promptUniqueId?: string;
  llmModel?: string;
  llmTemperature?: number;
  cacheable?: boolean;
  cacheTtlSeconds?: number;
  expression?: Record<string, unknown>;
}

export type UpdateConditionRequest = CreateConditionRequest;

export interface ListConditionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
