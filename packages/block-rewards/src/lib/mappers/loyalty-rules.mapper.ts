import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { BadgeCategory, MoneyRule, ProductRule, EventRule } from '../types/loyalty-rules';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber } from './utils';

export const badgeCategoryMapper: ResourceMapper<BadgeCategory> = {
  type: 'badge_category',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    name: parseString(resource.attributes?.['name']) ?? '',
    description: parseString(resource.attributes?.['description']),
    displayOrder: parseNumber(resource.attributes?.['display_order']),
    imageUrl: parseString(resource.attributes?.['image_url']),
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
  }),
};

export const moneyRuleMapper: ResourceMapper<MoneyRule> = {
  type: 'money_rule',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    loyaltyUniqueId: parseString(resource.attributes?.['loyalty_unique_id']) ?? '',
    name: parseString(resource.attributes?.['name']) ?? '',
    description: parseString(resource.attributes?.['description']),
    minAmount: resource.attributes?.['min_amount'] as number | undefined,
    maxAmount: resource.attributes?.['max_amount'] as number | undefined,
    pointsPerUnit: parseNumber(resource.attributes?.['points_per_unit']),
    unitAmount: parseNumber(resource.attributes?.['unit_amount']),
    currency: parseString(resource.attributes?.['currency']),
    isActive: parseBoolean(resource.attributes?.['is_active']),
    startDate: parseDate(resource.attributes?.['start_date']),
    endDate: parseDate(resource.attributes?.['end_date']),
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
  }),
};

export const productRuleMapper: ResourceMapper<ProductRule> = {
  type: 'product_rule',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    loyaltyUniqueId: parseString(resource.attributes?.['loyalty_unique_id']) ?? '',
    name: parseString(resource.attributes?.['name']) ?? '',
    description: parseString(resource.attributes?.['description']),
    productUniqueId: parseString(resource.attributes?.['product_unique_id']),
    categoryUniqueId: parseString(resource.attributes?.['category_unique_id']),
    brandUniqueId: parseString(resource.attributes?.['brand_unique_id']),
    pointsEarned: parseNumber(resource.attributes?.['points_earned']),
    multiplier: resource.attributes?.['multiplier'] as number | undefined,
    isActive: parseBoolean(resource.attributes?.['is_active']),
    startDate: parseDate(resource.attributes?.['start_date']),
    endDate: parseDate(resource.attributes?.['end_date']),
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
  }),
};

export const eventRuleMapper: ResourceMapper<EventRule> = {
  type: 'event_rule',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    loyaltyUniqueId: parseString(resource.attributes?.['loyalty_unique_id']) ?? '',
    name: parseString(resource.attributes?.['name']) ?? '',
    description: parseString(resource.attributes?.['description']),
    eventType: parseString(resource.attributes?.['event_type']) ?? '',
    pointsEarned: parseNumber(resource.attributes?.['points_earned']),
    maxOccurrences: resource.attributes?.['max_occurrences'] as number | undefined,
    cooldownPeriod: resource.attributes?.['cooldown_period'] as number | undefined,
    isActive: parseBoolean(resource.attributes?.['is_active']),
    startDate: parseDate(resource.attributes?.['start_date']),
    endDate: parseDate(resource.attributes?.['end_date']),
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
  }),
};
