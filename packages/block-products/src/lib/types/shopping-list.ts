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

export interface CreateShoppingListRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateShoppingListRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface AddShoppingListItemRequest {
  productUniqueId: string;
  quantity?: number;
  note?: string;
}

export interface RemoveShoppingListItemRequest {
  productUniqueId: string;
}
