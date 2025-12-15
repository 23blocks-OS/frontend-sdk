import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ExpirationRule } from '../types/expiration-rule';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils';

export const expirationRuleMapper: ResourceMapper<ExpirationRule> = {
  type: 'expiration_rule',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    ruleType: parseString(resource.attributes['rule_type']) ?? '',
    daysToExpire: parseOptionalNumber(resource.attributes['days_to_expire']),
    expirationDate: parseDate(resource.attributes['expiration_date']),
    warningDays: parseOptionalNumber(resource.attributes['warning_days']),
    isActive: parseBoolean(resource.attributes['is_active']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
