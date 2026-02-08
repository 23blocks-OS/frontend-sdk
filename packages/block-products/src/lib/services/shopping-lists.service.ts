import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
  ListShoppingListsParams,
} from '../types/shopping-list.js';
import { shoppingListMapper } from '../mappers/shopping-list.mapper.js';

export interface ShoppingListsService {
  /**
   * List shopping lists with optional filtering, sorting, and pagination.
   * @param params - Filter options including status, user, and pagination
   * @returns Paginated result containing an array of ShoppingList items and page metadata
   */
  list(params?: ListShoppingListsParams): Promise<PageResult<ShoppingList>>;

  /**
   * Get a single shopping list by its unique identifier.
   * @param uniqueId - The shopping list unique ID
   * @returns The matching ShoppingList
   */
  get(uniqueId: string): Promise<ShoppingList>;

  /**
   * Create a new shopping list.
   * @param data - Shopping list creation payload including name, description, and visibility
   * @returns The newly created ShoppingList
   */
  create(data: CreateShoppingListRequest): Promise<ShoppingList>;

  /**
   * Update an existing shopping list.
   * @param uniqueId - The shopping list unique ID
   * @param data - Fields to update on the shopping list
   * @returns The updated ShoppingList
   */
  update(uniqueId: string, data: UpdateShoppingListRequest): Promise<ShoppingList>;

  /**
   * Delete a shopping list.
   * @param uniqueId - The shopping list unique ID
   * @returns Resolves when the shopping list has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Add a product item to the shopping list.
   * @param uniqueId - The shopping list unique ID
   * @param productUniqueId - The product unique ID to add
   * @param quantity - Quantity of the product (defaults to 1)
   * @returns The updated ShoppingList
   */
  addItem(uniqueId: string, productUniqueId: string, quantity?: number): Promise<ShoppingList>;

  /**
   * Remove a product item from the shopping list.
   * @param uniqueId - The shopping list unique ID
   * @param productUniqueId - The product unique ID to remove
   * @returns Resolves when the item has been removed
   */
  removeItem(uniqueId: string, productUniqueId: string): Promise<void>;

  /**
   * Update the quantity of a product item in the shopping list.
   * @param uniqueId - The shopping list unique ID
   * @param productUniqueId - The product unique ID to update
   * @param quantity - The new quantity
   * @returns The updated ShoppingList
   */
  updateItemQuantity(uniqueId: string, productUniqueId: string, quantity: number): Promise<ShoppingList>;
}

export function createShoppingListsService(transport: Transport, _config: { appId: string }): ShoppingListsService {
  return {
    async list(params?: ListShoppingListsParams): Promise<PageResult<ShoppingList>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/shopping_lists/', { params: queryParams });
      return decodePageResult(response, shoppingListMapper);
    },

    async get(uniqueId: string): Promise<ShoppingList> {
      const response = await transport.get<unknown>(`/shopping_lists/${uniqueId}/`);
      return decodeOne(response, shoppingListMapper);
    },

    async create(data: CreateShoppingListRequest): Promise<ShoppingList> {
      const response = await transport.post<unknown>('/shopping_lists/', {
        shopping_list: {
          name: data.name,
          description: data.description,
          is_public: data.isPublic,
          payload: data.payload,
        },
      });
      return decodeOne(response, shoppingListMapper);
    },

    async update(uniqueId: string, data: UpdateShoppingListRequest): Promise<ShoppingList> {
      const response = await transport.put<unknown>(`/shopping_lists/${uniqueId}`, {
        shopping_list: {
          name: data.name,
          description: data.description,
          is_public: data.isPublic,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, shoppingListMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/shopping_lists/${uniqueId}`);
    },

    async addItem(uniqueId: string, productUniqueId: string, quantity = 1): Promise<ShoppingList> {
      const response = await transport.post<unknown>(`/shopping_lists/${uniqueId}/items`, {
        item: {
          product_unique_id: productUniqueId,
          quantity,
        },
      });
      return decodeOne(response, shoppingListMapper);
    },

    async removeItem(uniqueId: string, productUniqueId: string): Promise<void> {
      await transport.delete(`/shopping_lists/${uniqueId}/items/${productUniqueId}`);
    },

    async updateItemQuantity(uniqueId: string, productUniqueId: string, quantity: number): Promise<ShoppingList> {
      const response = await transport.put<unknown>(`/shopping_lists/${uniqueId}/items/${productUniqueId}`, {
        item: { quantity },
      });
      return decodeOne(response, shoppingListMapper);
    },
  };
}
