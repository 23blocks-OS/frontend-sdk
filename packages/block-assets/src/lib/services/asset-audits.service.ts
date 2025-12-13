import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetAudit,
  CreateAssetAuditRequest,
  UpdateAssetAuditRequest,
  ListAssetAuditsParams,
} from '../types/asset-audit';
import { assetAuditMapper } from '../mappers/asset-audit.mapper';

export interface AssetAuditsService {
  list(params?: ListAssetAuditsParams): Promise<PageResult<AssetAudit>>;
  get(uniqueId: string): Promise<AssetAudit>;
  create(data: CreateAssetAuditRequest): Promise<AssetAudit>;
  update(uniqueId: string, data: UpdateAssetAuditRequest): Promise<AssetAudit>;
  delete(uniqueId: string): Promise<void>;
  listByAsset(assetUniqueId: string, params?: ListAssetAuditsParams): Promise<PageResult<AssetAudit>>;
}

export function createAssetAuditsService(transport: Transport, _config: { appId: string }): AssetAuditsService {
  return {
    async list(params?: ListAssetAuditsParams): Promise<PageResult<AssetAudit>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.assetUniqueId) queryParams['asset_unique_id'] = params.assetUniqueId;
      if (params?.auditorUniqueId) queryParams['auditor_unique_id'] = params.auditorUniqueId;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/asset_audits', { params: queryParams });
      return decodePageResult(response, assetAuditMapper);
    },

    async get(uniqueId: string): Promise<AssetAudit> {
      const response = await transport.get<unknown>(`/asset_audits/${uniqueId}`);
      return decodeOne(response, assetAuditMapper);
    },

    async create(data: CreateAssetAuditRequest): Promise<AssetAudit> {
      const response = await transport.post<unknown>('/asset_audits', {
        data: {
          type: 'AssetAudit',
          attributes: {
            asset_unique_id: data.assetUniqueId,
            audit_date: data.auditDate.toISOString(),
            auditor_unique_id: data.auditorUniqueId,
            condition: data.condition,
            location: data.location,
            notes: data.notes,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, assetAuditMapper);
    },

    async update(uniqueId: string, data: UpdateAssetAuditRequest): Promise<AssetAudit> {
      const response = await transport.put<unknown>(`/asset_audits/${uniqueId}`, {
        data: {
          type: 'AssetAudit',
          attributes: {
            audit_date: data.auditDate?.toISOString(),
            auditor_unique_id: data.auditorUniqueId,
            condition: data.condition,
            location: data.location,
            notes: data.notes,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, assetAuditMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/asset_audits/${uniqueId}`);
    },

    async listByAsset(assetUniqueId: string, params?: ListAssetAuditsParams): Promise<PageResult<AssetAudit>> {
      const queryParams: Record<string, string> = {
        asset_unique_id: assetUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/asset_audits', { params: queryParams });
      return decodePageResult(response, assetAuditMapper);
    },
  };
}
