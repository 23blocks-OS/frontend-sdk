export interface AIModel {
  id: string;
  uniqueId: string;
  name: string;
  vendorName?: string;
  vendorUniqueId?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  inputTokenCost?: number;
  inputTokenCostCurrency?: string;
  outputTokenCost?: number;
  outputTokenCostCurrency?: string;
  apiUrl?: string;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches aimodels_params in ai_models_controller.rb */
export interface CreateAIModelRequest {
  name: string;
  vendorName?: string;
  vendorUniqueId?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  inputTokenCost?: number;
  inputTokenCostCurrency?: string;
  outputTokenCost?: number;
  outputTokenCostCurrency?: string;
  apiUrl?: string;
  status?: string;
}

export type UpdateAIModelRequest = CreateAIModelRequest;

export interface ListAIModelsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
