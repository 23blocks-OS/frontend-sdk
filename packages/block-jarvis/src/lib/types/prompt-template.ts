export interface PromptTemplate {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  schema?: Record<string, unknown>;
  formDefinition?: Record<string, unknown>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPromptTemplatesParams {
  page?: number;
  perPage?: number;
  includeSchema?: boolean;
}
