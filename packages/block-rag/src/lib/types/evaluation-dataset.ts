export interface EvaluationDataset {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  entityId?: string;
  fileType?: string;
  totalQuestions: number;
  tags?: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvaluationDatasetRequest {
  name: string;
  description?: string;
  entityId?: string;
  fileType?: 'entity' | 'account' | 'contact' | 'user' | 'storage';
  tags?: string[];
}

export interface UpdateEvaluationDatasetRequest {
  name?: string;
  description?: string;
  tags?: string[];
}

export interface ListEvaluationDatasetsParams {
  page?: number;
  pageSize?: number;
}
