import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AssetAudit } from '../types/asset-audit';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const assetAuditMapper: ResourceMapper<AssetAudit> = {
  type: 'AssetAudit',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    assetUniqueId: parseString(resource.attributes['asset_unique_id']) || '',
    auditDate: parseDate(resource.attributes['audit_date']) || new Date(),
    auditorUniqueId: parseString(resource.attributes['auditor_unique_id']) || '',
    condition: parseString(resource.attributes['condition']),
    location: parseString(resource.attributes['location']),
    notes: parseString(resource.attributes['notes']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
