import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FormSet, FormSetItem } from '../types/form-set.js';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils.js';

export const formSetMapper: ResourceMapper<FormSet> = {
  type: 'FormSet',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    category: parseString(resource.attributes['category']),
    appliesTo: parseString(resource.attributes['applies_to']),
    isActive: resource.attributes['is_active'] !== undefined
      ? parseBoolean(resource.attributes['is_active'])
      : undefined,
    isDefault: resource.attributes['is_default'] !== undefined
      ? parseBoolean(resource.attributes['is_default'])
      : undefined,
    sendAllAtOnce: resource.attributes['send_all_at_once'] !== undefined
      ? parseBoolean(resource.attributes['send_all_at_once'])
      : undefined,
    allowPartialCompletion: resource.attributes['allow_partial_completion'] !== undefined
      ? parseBoolean(resource.attributes['allow_partial_completion'])
      : undefined,
    enforceSequential: resource.attributes['enforce_sequential'] !== undefined
      ? parseBoolean(resource.attributes['enforce_sequential'])
      : undefined,
    expirationDays: parseOptionalNumber(resource.attributes['expiration_days']),
    autoAssignRules: resource.attributes['auto_assign_rules'] as Record<string, unknown> | undefined,
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
    formSetItemsAttributes: (resource.attributes['form_set_items_attributes'] as FormSetItem[]) || undefined,
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
