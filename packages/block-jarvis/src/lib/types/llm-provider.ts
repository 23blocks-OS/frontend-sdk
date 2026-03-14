export interface LlmProvider {
  id: string;
  uniqueId: string;
  name: string;
  providerType?: string;
  apiUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LlmProviderModel {
  id: string;
  name: string;
  provider?: string;
}

export interface LlmProviderValidation {
  valid: boolean;
  message?: string;
}
