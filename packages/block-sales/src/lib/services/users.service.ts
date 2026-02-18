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

function buildUserBody(data: RegisterSalesUserRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.firstName) body['first_name'] = data.firstName;
  if (data.lastName) body['last_name'] = data.lastName;
  if (data.email) body['email'] = data.email;
  if (data.phone) body['phone'] = data.phone;
  if (data.avatarUrl) body['avatar_url'] = data.avatarUrl;
  if (data.roleName) body['role_name'] = data.roleName;
  if (data.roleUniqueId) body['role_unique_id'] = data.roleUniqueId;
  if (data.stripeId) body['stripe_id'] = data.stripeId;
  if (data.timeZone) body['time_zone'] = data.timeZone;
  if (data.preferredLanguage) body['preferred_language'] = data.preferredLanguage;
  if (data.emailNotifications !== undefined) body['email_notifications'] = data.emailNotifications;
  if (data.smsNotifications !== undefined) body['sms_notifications'] = data.smsNotifications;
  if (data.whatsappNotifications !== undefined) body['whatsapp_notifications'] = data.whatsappNotifications;
  if (data.otherNotifications !== undefined) body['other_notifications'] = data.otherNotifications;
  return body;
}

export interface SalesUsersService {
  list(params?: ListSalesUsersParams): Promise<PageResult<SalesUser>>;
  get(uniqueId: string): Promise<SalesUser>;
  register(uniqueId: string, data?: RegisterSalesUserRequest): Promise<SalesUser>;
  update(uniqueId: string, data: UpdateSalesUserRequest): Promise<SalesUser>;
  listOrders(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Order>>;
  getOrder(uniqueId: string, orderUniqueId: string): Promise<Order>;
  listSubscriptions(uniqueId: string, params?: ListUserSubscriptionsParams): Promise<PageResult<UserSubscription>>;
  getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription>;
  createSubscription(uniqueId: string, subscriptionUniqueId: string, data: CreateUserSubscriptionRequest): Promise<UserSubscription>;
  updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateUserSubscriptionRequest): Promise<UserSubscription>;
  addConsumption(uniqueId: string, subscriptionUniqueId: string, data: AddSubscriptionConsumptionRequest): Promise<UserSubscription>;
  cancelSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<UserSubscription>;
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
        user: data ? buildUserBody(data) : {},
      });
      return decodeOne(response, salesUserMapper);
    },

    async update(uniqueId: string, data: UpdateSalesUserRequest): Promise<SalesUser> {
      const response = await transport.put<unknown>(`/users/${uniqueId}`, {
        user: buildUserBody(data),
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
        },
      });
      return decodeOne(response, userSubscriptionMapper);
    },

    async addConsumption(uniqueId: string, subscriptionUniqueId: string, data: AddSubscriptionConsumptionRequest): Promise<UserSubscription> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/subscriptions/${subscriptionUniqueId}/consumption`, {
        consumption: data.consumption,
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
