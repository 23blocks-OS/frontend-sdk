import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  SalesCustomer,
  RegisterSalesCustomerRequest,
  CustomerSubscription,
  CreateCustomerSubscriptionRequest,
  UpdateCustomerSubscriptionRequest,
} from '../types/customer.js';
import { salesCustomerMapper } from '../mappers/customer.mapper.js';

export interface SalesCustomersService {
  /**
   * Get a sales customer by unique ID.
   * @returns The matching SalesCustomer record.
   */
  get(uniqueId: string): Promise<SalesCustomer>;

  /**
   * Register a user as a sales customer.
   * @returns The newly registered SalesCustomer record.
   */
  register(uniqueId: string, data?: RegisterSalesCustomerRequest): Promise<SalesCustomer>;

  /**
   * Get a specific subscription for a customer.
   * @returns The matching CustomerSubscription record.
   */
  getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<CustomerSubscription>;

  /**
   * Create a new subscription for a customer.
   * @returns The newly created CustomerSubscription record.
   */
  createSubscription(uniqueId: string, data: CreateCustomerSubscriptionRequest): Promise<CustomerSubscription>;

  /**
   * Update an existing customer subscription.
   * @returns The updated CustomerSubscription record.
   */
  updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateCustomerSubscriptionRequest): Promise<CustomerSubscription>;
}

export function createSalesCustomersService(transport: Transport, _config: { appId: string }): SalesCustomersService {
  return {
    async get(uniqueId: string): Promise<SalesCustomer> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}`);
      return decodeOne(response, salesCustomerMapper);
    },

    async register(uniqueId: string, data?: RegisterSalesCustomerRequest): Promise<SalesCustomer> {
      const response = await transport.post<unknown>(`/customers/${uniqueId}/register`, {
        customer: {
          email: data?.email,
          name: data?.name,
          phone: data?.phone,
          stripe_customer_id: data?.stripeCustomerId,
          mercadopago_customer_id: data?.mercadopagoCustomerId,
          payload: data?.payload,
        },
      });
      return decodeOne(response, salesCustomerMapper);
    },

    async getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<CustomerSubscription> {
      const response = await transport.get<any>(`/customers/${uniqueId}/subscriptions/${subscriptionUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        customerUniqueId: response.customer_unique_id,
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

    async createSubscription(uniqueId: string, data: CreateCustomerSubscriptionRequest): Promise<CustomerSubscription> {
      const response = await transport.post<any>(`/customers/${uniqueId}/subscriptions`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          start_date: data.startDate,
          trial_end_date: data.trialEndDate,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        customerUniqueId: response.customer_unique_id,
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

    async updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateCustomerSubscriptionRequest): Promise<CustomerSubscription> {
      const response = await transport.put<any>(`/customers/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          status: data.status,
          end_date: data.endDate,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        customerUniqueId: response.customer_unique_id,
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
  };
}
