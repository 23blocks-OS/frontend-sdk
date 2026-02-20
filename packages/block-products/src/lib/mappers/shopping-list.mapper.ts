import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ShoppingList } from '../types/shopping-list.js';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils.js';

export const shoppingListMapper: ResourceMapper<ShoppingList> = {
  type: 'shopping_list',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.id,
    userUniqueId: parseString(resource.attributes['user_unique_id']) ?? '',
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    isPublic: parseBoolean(resource.attributes['is_public']),
    itemCount: parseOptionalNumber(resource.attributes['item_count']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) ?? new Date(),
  }),
};
