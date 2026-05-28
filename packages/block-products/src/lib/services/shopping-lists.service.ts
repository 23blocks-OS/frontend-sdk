import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
  AddShoppingListItemRequest,
  ListShoppingListsParams,
} from '../types/shopping-list.js';
import { shoppingListMapper } from '../mappers/shopping-list.mapper.js';

export interface ShoppingListsService {
  /**
   * List shopping lists for a user.
   * @param userUniqueId - The user's UUID
   * @param params - Optional filtering, sorting, and pagination
   * @returns Paginated result of ShoppingList records
   */
  list(userUniqueId: string, params?: ListShoppingListsParams): Promise<PageResult<ShoppingList>>;

  /**
   * Get a single shopping list belonging to a user.
   * @param userUniqueId - The user's UUID
   * @param listUniqueId - The shopping list's UUID
   * @returns The matching ShoppingList
   */
  get(userUniqueId: string, listUniqueId: string): Promise<ShoppingList>;

  /**
   * Create a new shopping list for a user.
   * @param userUniqueId - The user's UUID
   * @param data - Shopping list creation payload
   * @returns The newly created ShoppingList
   */
  create(userUniqueId: string, data: CreateShoppingListRequest): Promise<ShoppingList>;

  /**
   * Update an existing shopping list.
   * @param userUniqueId - The user's UUID
   * @param listUniqueId - The shopping list's UUID
   * @param data - Fields to update
   * @returns The updated ShoppingList
   */
  update(userUniqueId: string, listUniqueId: string, data: UpdateShoppingListRequest): Promise<ShoppingList>;

  /**
   * Delete a shopping list.
   * @param userUniqueId - The user's UUID
   * @param listUniqueId - The shopping list's UUID
   * @returns Resolves when the list has been deleted
   */
  delete(userUniqueId: string, listUniqueId: string): Promise<void>;

  /**
   * Add a product to a shopping list, or increase the quantity of an
   * existing item. The `quantity` field is treated as a **delta**: if the
   * SKU already exists in the list, the backend adds the value to the
   * existing quantity (positive to increase, negative to decrease). When
   * the resulting quantity goes to zero or below, the item is removed.
   *
   * To set an absolute quantity, calculate the delta from the current
   * value and pass that. To reduce by one, pass `-1`.
   *
   * @param userUniqueId - The user's UUID
   * @param listUniqueId - The shopping list's UUID
   * @param data - Product SKU, quantity delta, and optional category/notes
   * @returns The updated ShoppingList with full item state
   */
  addItem(userUniqueId: string, listUniqueId: string, data: AddShoppingListItemRequest): Promise<ShoppingList>;

  /**
   * Remove a product from the shopping list entirely.
   * @param userUniqueId - The user's UUID
   * @param listUniqueId - The shopping list's UUID
   * @param sku - The product SKU to remove
   * @returns The updated ShoppingList without the removed item
   */
  removeItem(userUniqueId: string, listUniqueId: string, sku: string): Promise<ShoppingList>;
}

export function createShoppingListsService(transport: Transport, _config: { apiKey: string }): ShoppingListsService {
  return {
    async list(userUniqueId: string, params?: ListShoppingListsParams): Promise<PageResult<ShoppingList>> {
      assertUuid(userUniqueId, 'userUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/shoppinglists`, { params: queryParams });
      return decodePageResult(response, shoppingListMapper);
    },

    async get(userUniqueId: string, listUniqueId: string): Promise<ShoppingList> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(listUniqueId, 'listUniqueId');
      const response = await transport.get<unknown>(`/users/${userUniqueId}/shoppinglists/${listUniqueId}`);
      return decodeOne(response, shoppingListMapper);
    },

    async create(userUniqueId: string, data: CreateShoppingListRequest): Promise<ShoppingList> {
      assertUuid(userUniqueId, 'userUniqueId');
      const response = await transport.post<unknown>(`/users/${userUniqueId}/shoppinglists`, {
        shopping_list: {
          name: data.name,
          notes: data.notes,
          delivery: data.delivery,
          status: data.status,
          enabled: data.enabled,
          qcode: data.qcode,
        },
      });
      return decodeOne(response, shoppingListMapper);
    },

    async update(userUniqueId: string, listUniqueId: string, data: UpdateShoppingListRequest): Promise<ShoppingList> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(listUniqueId, 'listUniqueId');
      const response = await transport.put<unknown>(`/users/${userUniqueId}/shoppinglists/${listUniqueId}`, {
        shopping_list: {
          name: data.name,
          notes: data.notes,
          delivery: data.delivery,
          enabled: data.enabled,
          qcode: data.qcode,
        },
      });
      return decodeOne(response, shoppingListMapper);
    },

    async delete(userUniqueId: string, listUniqueId: string): Promise<void> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(listUniqueId, 'listUniqueId');
      await transport.delete(`/users/${userUniqueId}/shoppinglists/${listUniqueId}`);
    },

    async addItem(userUniqueId: string, listUniqueId: string, data: AddShoppingListItemRequest): Promise<ShoppingList> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(listUniqueId, 'listUniqueId');
      const response = await transport.post<unknown>(
        `/users/${userUniqueId}/shoppinglists/${listUniqueId}/products`,
        {
          product: {
            sku: data.sku,
            quantity: data.quantity,
            notes: data.notes,
            category_name: data.categoryName,
            category_unique_id: data.categoryUniqueId,
          },
        },
      );
      return decodeOne(response, shoppingListMapper);
    },

    async removeItem(userUniqueId: string, listUniqueId: string, sku: string): Promise<ShoppingList> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(listUniqueId, 'listUniqueId');
      // DELETE requires a body — Rails reads the SKU from there, not the URL.
      const response = await transport.delete<unknown>(
        `/users/${userUniqueId}/shoppinglists/${listUniqueId}/products`,
        { body: { product: { sku } } },
      );
      return decodeOne(response, shoppingListMapper);
    },
  };
}
