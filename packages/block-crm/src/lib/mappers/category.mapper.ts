import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { Category, AccountCategory } from '../types/category';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

export const categoryMapper: JsonApiMapper<Category> = {
  type: 'category',
  map(resource: JsonApiResource): Category {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      name: parseString(attrs['name']) || '',
      code: parseString(attrs['code']),
      description: parseString(attrs['description']),
      parentUniqueId: parseString(attrs['parent_unique_id']),
      order: parseOptionalNumber(attrs['order']),
      color: parseString(attrs['color']),
      icon: parseString(attrs['icon']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};

export const accountCategoryMapper: JsonApiMapper<AccountCategory> = {
  type: 'account_category',
  map(resource: JsonApiResource): AccountCategory {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      accountUniqueId: parseString(attrs['account_unique_id']) || '',
      categoryUniqueId: parseString(attrs['category_unique_id']) || '',
      order: parseOptionalNumber(attrs['order']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
