import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AssetEvent, AssetEventType } from '../types/asset-event';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

function parseEventType(value: unknown): AssetEventType {
  const eventType = parseString(value);
  if (
    eventType === 'maintenance' ||
    eventType === 'transfer' ||
    eventType === 'inspection' ||
    eventType === 'repair' ||
    eventType === 'calibration' ||
    eventType === 'cleaning' ||
    eventType === 'upgrade' ||
    eventType === 'other'
  ) {
    return eventType;
  }
  return 'other';
}

export const assetEventMapper: ResourceMapper<AssetEvent> = {
  type: 'AssetEvent',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    assetUniqueId: parseString(resource.attributes['asset_unique_id']) || '',
    eventType: parseEventType(resource.attributes['event_type']),
    eventDate: parseDate(resource.attributes['event_date']) || new Date(),
    description: parseString(resource.attributes['description']),
    performedByUniqueId: parseString(resource.attributes['performed_by_unique_id']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    notes: parseString(resource.attributes['notes']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
