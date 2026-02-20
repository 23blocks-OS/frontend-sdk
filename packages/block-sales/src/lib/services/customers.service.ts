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
import { customerSubscriptionMapper } from '../mappers/customer-subscription.mapper.js';

function buildCustomerBody(data: RegisterSalesCustomerRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.email) body['email'] = data.email;
  if (data.phone) body['phone'] = data.phone;
  if (data.companyUniqueId) body['company_unique_id'] = data.companyUniqueId;
  if (data.stripeId) body['stripe_id'] = data.stripeId;
  if (data.status) body['status'] = data.status;
  if (data.timeZone) body['time_zone'] = data.timeZone;
  if (data.preferredLanguage) body['preferred_language'] = data.preferredLanguage;
  if (data.avatarUrl) body['avatar_url'] = data.avatarUrl;
  if (data.emailNotifications !== undefined) body['email_notifications'] = data.emailNotifications;
  if (data.smsNotifications !== undefined) body['sms_notifications'] = data.smsNotifications;
  if (data.whatsappNotifications !== undefined) body['whatsapp_notifications'] = data.whatsappNotifications;
  if (data.otherNotifications !== undefined) body['other_notifications'] = data.otherNotifications;
  if (data.source) body['source'] = data.source;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  return body;
}

export interface SalesCustomersService {
  get(uniqueId: string): Promise<SalesCustomer>;
  register(uniqueId: string, data?: RegisterSalesCustomerRequest): Promise<SalesCustomer>;
  getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<CustomerSubscription>;
  createSubscription(uniqueId: string, data: CreateCustomerSubscriptionRequest): Promise<CustomerSubscription>;
  updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateCustomerSubscriptionRequest): Promise<CustomerSubscription>;
}

export function createSalesCustomersService(transport: Transport, _config: { apiKey: string }): SalesCustomersService {
  return {
    async get(uniqueId: string): Promise<SalesCustomer> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}`);
      return decodeOne(response, salesCustomerMapper);
    },

    async register(uniqueId: string, data?: RegisterSalesCustomerRequest): Promise<SalesCustomer> {
      const response = await transport.post<unknown>(`/customers/${uniqueId}/register`, {
        customer: data ? buildCustomerBody(data) : {},
      });
      return decodeOne(response, salesCustomerMapper);
    },

    async getSubscription(uniqueId: string, subscriptionUniqueId: string): Promise<CustomerSubscription> {
      const response = await transport.get<unknown>(`/customers/${uniqueId}/subscriptions/${subscriptionUniqueId}`);
      return decodeOne(response, customerSubscriptionMapper);
    },

    async createSubscription(uniqueId: string, data: CreateCustomerSubscriptionRequest): Promise<CustomerSubscription> {
      const response = await transport.post<unknown>(`/customers/${uniqueId}/subscriptions`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          subscription_number: data.subscriptionNumber,
          notes: data.notes,
        },
      });
      return decodeOne(response, customerSubscriptionMapper);
    },

    async updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateCustomerSubscriptionRequest): Promise<CustomerSubscription> {
      const response = await transport.put<unknown>(`/customers/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          subscription_number: data.subscriptionNumber,
          notes: data.notes,
        },
      });
      return decodeOne(response, customerSubscriptionMapper);
    },
  };
}
