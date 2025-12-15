import type { IdentityCore } from '@23blocks/contracts';

export interface AssetOperation extends IdentityCore {
  assetUniqueId: string;
  operationType: string;
  description?: string;
  performedBy?: string;
  performedAt: Date;
  status: string;
  result?: string;
  payload?: Record<string, unknown>;
}

export interface CreateAssetOperationRequest {
  operationType: string;
  description?: string;
  performedBy?: string;
  result?: string;
  payload?: Record<string, unknown>;
}

export interface ListAssetOperationsParams {
  page?: number;
  perPage?: number;
  operationType?: string;
}

export interface OperationReportParams {
  startDate?: string;
  endDate?: string;
  operationType?: string;
}

export interface OperationReportSummary {
  totalOperations: number;
  operationsByType: Record<string, number>;
  period: {
    startDate: Date;
    endDate: Date;
  };
}
