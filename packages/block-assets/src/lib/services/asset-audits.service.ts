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
  list(assetUniqueId: string, params?: ListAssetAuditsParams): Promise<PageResult<AssetAudit>>;
  get(assetUniqueId: string, auditUniqueId: string): Promise<AssetAudit>;
  create(assetUniqueId: string, data: CreateAssetAuditRequest): Promise<AssetAudit>;
  update(assetUniqueId: string, auditUniqueId: string, data: UpdateAssetAuditRequest): Promise<AssetAudit>;
  delete(assetUniqueId: string, auditUniqueId: string): Promise<void>;
}

export function createAssetAuditsService(transport: Transport, _config: { appId: string }): AssetAuditsService {
  return {
    async list(assetUniqueId: string, params?: ListAssetAuditsParams): Promise<PageResult<AssetAudit>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/audits`, { params: queryParams });
      return decodePageResult(response, assetAuditMapper);
    },

    async get(assetUniqueId: string, auditUniqueId: string): Promise<AssetAudit> {
      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/audits/${auditUniqueId}`);
      return decodeOne(response, assetAuditMapper);
    },

    async create(assetUniqueId: string, data: CreateAssetAuditRequest): Promise<AssetAudit> {
      const response = await transport.post<unknown>(`/assets/${assetUniqueId}/audits`, {
        audit: {
          audit_date: data.auditDate.toISOString(),
          auditor_unique_id: data.auditorUniqueId,
          condition: data.condition,
          location: data.location,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetAuditMapper);
    },

    async update(assetUniqueId: string, auditUniqueId: string, data: UpdateAssetAuditRequest): Promise<AssetAudit> {
      const response = await transport.post<unknown>(`/assets/${assetUniqueId}/audits/${auditUniqueId}`, {
        audit: {
          audit_date: data.auditDate?.toISOString(),
          auditor_unique_id: data.auditorUniqueId,
          condition: data.condition,
          location: data.location,
          notes: data.notes,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetAuditMapper);
    },

    async delete(assetUniqueId: string, auditUniqueId: string): Promise<void> {
      await transport.delete(`/assets/${assetUniqueId}/audits/${auditUniqueId}`);
    },
  };
}
