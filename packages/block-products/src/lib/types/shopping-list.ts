import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ShoppingList extends IdentityCore {
  userUniqueId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  itemCount?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ShoppingListItem {
  productUniqueId: string;
  quantity: number;
  note?: string;
  addedAt?: Date;
}

export interface ListShoppingListsParams {
  page?: number;
  perPage?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateShoppingListRequest {
  name: string;
  notes?: string;
  delivery?: number;
  status?: EntityStatus;
  enabled?: boolean;
  qcode?: string;
}

export interface UpdateShoppingListRequest {
  name?: string;
  notes?: string;
  delivery?: number;
  enabled?: boolean;
  qcode?: string;
}

export interface AddShoppingListItemRequest {
  sku: string;
  quantity?: number;
  notes?: string;
  categoryName?: string;
  categoryUniqueId?: string;
}

export interface RemoveShoppingListItemRequest {
  productUniqueId: string;
}
