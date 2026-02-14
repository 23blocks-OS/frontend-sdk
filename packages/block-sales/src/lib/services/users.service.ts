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
  createSubscription(uniqueId: string, subscriptionUniqueId: string, data?: CreateUserSubscriptionRequest): Promise<UserSubscription>;

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

      const response = await transport.get<any>(`/users/${uniqueId}/subscriptions`, { params: queryParams });
      const data = response.data || [];
      return {
        data: data.map((s: any) => ({
          id: s.id,
          uniqueId: s.unique_id,
          userUniqueId: s.user_unique_id,
          subscriptionModelUniqueId: s.subscription_model_unique_id,
          status: s.status,
          startDate: s.start_date ? new Date(s.start_date) : undefined,
          endDate: s.end_date ? new Date(s.end_date) : undefined,
          trialEndDate: s.trial_end_date ? new Date(s.trial_end_date) : undefined,
          cancelledAt: s.cancelled_at ? new Date(s.cancelled_at) : undefined,
          consumptions: (s.consumptions || []).map((c: any) => ({
            id: c.id,
            quantity: c.quantity,
            description: c.description,
            consumedAt: new Date(c.consumed_at),
          })),
          payload: s.payload,
          createdAt: new Date(s.created_at),
          updatedAt: new Date(s.updated_at),
        })),
        meta: {
          totalCount: response.meta?.total_count || data.length,
          currentPage: response.meta?.current_page || 1,
          perPage: response.meta?.per_page || data.length,
          totalPages: response.meta?.total_pages || 1,
        },
      };
    },

    async getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription> {
      const response = await transport.get<any>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
        subscriptionModelUniqueId: response.subscription_model_unique_id,
        status: response.status,
        startDate: response.start_date ? new Date(response.start_date) : undefined,
        endDate: response.end_date ? new Date(response.end_date) : undefined,
        trialEndDate: response.trial_end_date ? new Date(response.trial_end_date) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        consumptions: (response.consumptions || []).map((c: any) => ({
          id: c.id,
          quantity: c.quantity,
          description: c.description,
          consumedAt: new Date(c.consumed_at),
        })),
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async createSubscription(uniqueId: string, subscriptionUniqueId: string, data?: CreateUserSubscriptionRequest): Promise<UserSubscription> {
      const response = await transport.post<any>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          start_date: data?.startDate,
          trial_end_date: data?.trialEndDate,
          payload: data?.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
        subscriptionModelUniqueId: response.subscription_model_unique_id,
        status: response.status,
        startDate: response.start_date ? new Date(response.start_date) : undefined,
        endDate: response.end_date ? new Date(response.end_date) : undefined,
        trialEndDate: response.trial_end_date ? new Date(response.trial_end_date) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateUserSubscriptionRequest): Promise<UserSubscription> {
      const response = await transport.put<any>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          status: data.status,
          end_date: data.endDate,
          max_items: data.maxItems,
          consumption: data.consumption,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
        subscriptionModelUniqueId: response.subscription_model_unique_id,
        status: response.status,
        startDate: response.start_date ? new Date(response.start_date) : undefined,
        endDate: response.end_date ? new Date(response.end_date) : undefined,
        trialEndDate: response.trial_end_date ? new Date(response.trial_end_date) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async addConsumption(uniqueId: string, subscriptionUniqueId: string, data: AddSubscriptionConsumptionRequest): Promise<UserSubscription> {
      const response = await transport.post<any>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}/consumption`, {
        consumption: {
          quantity: data.quantity,
          description: data.description,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
        subscriptionModelUniqueId: response.subscription_model_unique_id,
        status: response.status,
        startDate: response.start_date ? new Date(response.start_date) : undefined,
        endDate: response.end_date ? new Date(response.end_date) : undefined,
        trialEndDate: response.trial_end_date ? new Date(response.trial_end_date) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        consumptions: (response.consumptions || []).map((c: any) => ({
          id: c.id,
          quantity: c.quantity,
          description: c.description,
          consumedAt: new Date(c.consumed_at),
        })),
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async cancelSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription> {
      const response = await transport.put<any>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}/cancel`, {});
      return {
        id: response.id,
        uniqueId: response.unique_id,
        userUniqueId: response.user_unique_id,
        subscriptionModelUniqueId: response.subscription_model_unique_id,
        status: response.status,
        startDate: response.start_date ? new Date(response.start_date) : undefined,
        endDate: response.end_date ? new Date(response.end_date) : undefined,
        trialEndDate: response.trial_end_date ? new Date(response.trial_end_date) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async deleteSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<void> {
      await transport.delete(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}`);
    },
  };
}
