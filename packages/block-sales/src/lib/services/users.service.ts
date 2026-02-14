import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SalesUser,
  RegisterSalesUserRequest,
  UpdateSalesUserRequest,
  ListSalesUsersParams,
  UserSubscription,
  CreateUserSubscriptionRequest,
  UpdateUserSubscriptionRequest,
  AddSubscriptionConsumptionRequest,
  ListUserSubscriptionsParams,
} from '../types/user.js';
import type { Order } from '../types/order.js';
import { salesUserMapper } from '../mappers/user.mapper.js';
import { orderMapper } from '../mappers/order.mapper.js';
import { userSubscriptionMapper } from '../mappers/user-subscription.mapper.js';

export interface SalesUsersService {
  /**
   * List sales users with optional filtering and sorting.
   * @returns Paginated list of SalesUser records with metadata.
   */
  list(params?: ListSalesUsersParams): Promise<PageResult<SalesUser>>;

  /**
   * Get a sales user by unique ID.
   * @returns The matching SalesUser record.
   */
  get(uniqueId: string): Promise<SalesUser>;

  /**
   * Register a user in the sales system.
   * @returns The newly registered SalesUser record.
   */
  register(uniqueId: string, data?: RegisterSalesUserRequest): Promise<SalesUser>;

  /**
   * Update a sales user.
   * @returns The updated SalesUser record.
   */
  update(uniqueId: string, data: UpdateSalesUserRequest): Promise<SalesUser>;

  /**
   * List orders for a specific user.
   * @returns Paginated list of Order records.
   */
  listOrders(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Order>>;

  /**
   * Get a specific order for a user.
   * @returns The matching Order record.
   */
  getOrder(uniqueId: string, orderUniqueId: string): Promise<Order>;

  /**
   * List subscriptions for a user.
   * @returns Paginated list of UserSubscription records.
   */
  listSubscriptions(uniqueId: string, params?: ListUserSubscriptionsParams): Promise<PageResult<UserSubscription>>;

  /**
   * Get a specific subscription for a user.
   * @returns The matching UserSubscription record.
   */
  getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription>;

  /**
   * Create a subscription for a user based on a subscription model.
   * @returns The newly created UserSubscription record.
   */
  createSubscription(uniqueId: string, subscriptionUniqueId: string, data: CreateUserSubscriptionRequest): Promise<UserSubscription>;

  /**
   * Update a user subscription.
   * @returns The updated UserSubscription record.
   */
  updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateUserSubscriptionRequest): Promise<UserSubscription>;

  /**
   * Add a consumption record to a user subscription.
   * @returns The updated UserSubscription record with consumption data.
   */
  addConsumption(uniqueId: string, subscriptionUniqueId: string, data: AddSubscriptionConsumptionRequest): Promise<UserSubscription>;

  /**
   * Cancel a user subscription.
   * @returns The UserSubscription record with cancelled status.
   */
  cancelSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription>;

  /**
   * Delete a user subscription.
   */
  deleteSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<void>;
}

export function createSalesUsersService(transport: Transport, _config: { appId: string }): SalesUsersService {
  return {
    async list(params?: ListSalesUsersParams): Promise<PageResult<SalesUser>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/users', { params: queryParams });
      return decodePageResult(response, salesUserMapper);
    },

    async get(uniqueId: string): Promise<SalesUser> {
      const response = await transport.get<unknown>(`/users/${uniqueId}`);
      return decodeOne(response, salesUserMapper);
    },

    async register(uniqueId: string, data?: RegisterSalesUserRequest): Promise<SalesUser> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/register`, {
        user: {
          email: data?.email,
          name: data?.name,
          phone: data?.phone,
          payload: data?.payload,
        },
      });
      return decodeOne(response, salesUserMapper);
    },

    async update(uniqueId: string, data: UpdateSalesUserRequest): Promise<SalesUser> {
      const response = await transport.put<unknown>(`/users/${uniqueId}`, {
        user: {
          name: data.name,
          phone: data.phone,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, salesUserMapper);
    },

    async listOrders(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Order>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>(`/users/${uniqueId}/orders`, { params: queryParams });
      return decodePageResult(response, orderMapper);
    },

    async getOrder(uniqueId: string, orderUniqueId: string): Promise<Order> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/orders/${orderUniqueId}`);
      return decodeOne(response, orderMapper);
    },

    async listSubscriptions(uniqueId: string, params?: ListUserSubscriptionsParams): Promise<PageResult<UserSubscription>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${uniqueId}/subscriptions`, { params: queryParams });
      return decodePageResult(response, userSubscriptionMapper);
    },

    async getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`);
      return decodeOne(response, userSubscriptionMapper);
    },

    async createSubscription(uniqueId: string, subscriptionUniqueId: string, data: CreateUserSubscriptionRequest): Promise<UserSubscription> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          subscription_number: data.subscriptionNumber,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, userSubscriptionMapper);
    },

    async updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateUserSubscriptionRequest): Promise<UserSubscription> {
      const response = await transport.put<unknown>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          subscription_number: data.subscriptionNumber,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, userSubscriptionMapper);
    },

    async addConsumption(uniqueId: string, subscriptionUniqueId: string, data: AddSubscriptionConsumptionRequest): Promise<UserSubscription> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}/consumption`, {
        consumption: {
          quantity: data.quantity,
          description: data.description,
          payload: data.payload,
        },
      });
      return decodeOne(response, userSubscriptionMapper);
    },

    async cancelSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription> {
      const response = await transport.put<unknown>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}/cancel`, {});
      return decodeOne(response, userSubscriptionMapper);
    },

    async deleteSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<void> {
      await transport.delete(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`);
    },
  };
}
