import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AssetOperation } from '../types/asset-operation';
import { parseDate } from './utils';

export const assetOperationMapper: ResourceMapper<AssetOperation> = {
  type: 'asset_operation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    assetUniqueId: resource.attributes['asset_unique_id'] as string,
    operationType: resource.attributes['operation_type'] as string,
    description: resource.attributes['description'] as string | undefined,
    performedBy: resource.attributes['performed_by'] as string | undefined,
    performedAt: parseDate(resource.attributes['performed_at']),
    status: resource.attributes['status'] as string,
    result: resource.attributes['result'] as string | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
