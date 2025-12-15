import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ShoppingList,
  CreateShoppingListRequest,
  UpdateShoppingListRequest,
  ListShoppingListsParams,
} from '../types/shopping-list';
import { shoppingListMapper } from '../mappers/shopping-list.mapper';

export interface ShoppingListsService {
  list(params?: ListShoppingListsParams): Promise<PageResult<ShoppingList>>;
  get(uniqueId: string): Promise<ShoppingList>;
  create(data: CreateShoppingListRequest): Promise<ShoppingList>;
  update(uniqueId: string, data: UpdateShoppingListRequest): Promise<ShoppingList>;
  delete(uniqueId: string): Promise<void>;
  addItem(uniqueId: string, productUniqueId: string, quantity?: number): Promise<ShoppingList>;
  removeItem(uniqueId: string, productUniqueId: string): Promise<void>;
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
