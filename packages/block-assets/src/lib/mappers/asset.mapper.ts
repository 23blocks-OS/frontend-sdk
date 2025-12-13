import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Asset } from '../types/asset';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const assetMapper: ResourceMapper<Asset> = {
  type: 'Asset',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    assetType: parseString(resource.attributes['asset_type']),
    serialNumber: parseString(resource.attributes['serial_number']),
    model: parseString(resource.attributes['model']),
    manufacturer: parseString(resource.attributes['manufacturer']),

    // Financial
    purchaseDate: parseDate(resource.attributes['purchase_date']),
    purchasePrice: parseOptionalNumber(resource.attributes['purchase_price']),
    currentValue: parseOptionalNumber(resource.attributes['current_value']),

    // Location & Assignment
    locationUniqueId: parseString(resource.attributes['location_unique_id']),
    assignedToUniqueId: parseString(resource.attributes['assigned_to_unique_id']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
