import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetOperation,
  CreateAssetOperationRequest,
  ListAssetOperationsParams,
  OperationReportParams,
  OperationReportSummary,
} from '../types/asset-operation.js';
import { assetOperationMapper } from '../mappers/asset-operation.mapper.js';

export interface AssetOperationsService {
  /**
   * List operations for a specific asset.
   * @returns Paginated list of AssetOperation records with metadata.
   */
  list(assetUniqueId: string, params?: ListAssetOperationsParams): Promise<PageResult<AssetOperation>>;

  /**
   * Get a specific operation for an asset.
   * @returns The matching AssetOperation record.
   */
  get(assetUniqueId: string, operationUniqueId: string): Promise<AssetOperation>;

  /**
   * Create a new operation for an asset.
   * @returns The newly created AssetOperation record.
   */
  create(assetUniqueId: string, data: CreateAssetOperationRequest): Promise<AssetOperation>;

  /**
   * Get an operation report summary.
   * @returns OperationReportSummary with totals and breakdown by operation type.
   */
  reportSummary(params: OperationReportParams): Promise<OperationReportSummary>;
}

export function createAssetOperationsService(transport: Transport, _config: { appId: string }): AssetOperationsService {
  return {
    async list(assetUniqueId: string, params?: ListAssetOperationsParams): Promise<PageResult<AssetOperation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.operationType) queryParams['operation_type'] = params.operationType;

      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/operations`, { params: queryParams });
      return decodePageResult(response, assetOperationMapper);
    },

    async get(assetUniqueId: string, operationUniqueId: string): Promise<AssetOperation> {
      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/operations/${operationUniqueId}`);
      return decodeOne(response, assetOperationMapper);
    },

    async create(assetUniqueId: string, data: CreateAssetOperationRequest): Promise<AssetOperation> {
      const response = await transport.post<unknown>(`/assets/${assetUniqueId}/operations`, {
        operation: {
          operation_type: data.operationType,
          description: data.description,
          performed_by: data.performedBy,
          result: data.result,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetOperationMapper);
    },

    async reportSummary(params: OperationReportParams): Promise<OperationReportSummary> {
      const response = await transport.post<any>('/reports/operations/summary', {
        start_date: params.startDate,
        end_date: params.endDate,
        operation_type: params.operationType,
      });
      return {
        totalOperations: response.total_operations,
        operationsByType: response.operations_by_type,
        period: {
          startDate: new Date(response.period.start_date),
          endDate: new Date(response.period.end_date),
        },
      };
    },
  };
}
