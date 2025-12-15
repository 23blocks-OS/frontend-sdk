import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AssetAlert } from '../types/alert';
import { parseDate } from './utils';

export const assetAlertMapper: ResourceMapper<AssetAlert> = {
  type: 'asset_alert',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    assetUniqueId: resource.attributes['asset_unique_id'] as string | undefined,
    alertType: resource.attributes['alert_type'] as string,
    message: resource.attributes['message'] as string,
    severity: resource.attributes['severity'] as 'low' | 'medium' | 'high' | 'critical',
    status: resource.attributes['status'] as 'active' | 'acknowledged' | 'resolved',
    triggeredAt: parseDate(resource.attributes['triggered_at']),
    acknowledgedAt: resource.attributes['acknowledged_at'] ? parseDate(resource.attributes['acknowledged_at']) : undefined,
    resolvedAt: resource.attributes['resolved_at'] ? parseDate(resource.attributes['resolved_at']) : undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
