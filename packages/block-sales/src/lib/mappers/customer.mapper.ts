import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SalesCustomer } from '../types/customer';
import { parseDate } from './utils';

export const salesCustomerMapper: ResourceMapper<SalesCustomer> = {
  type: 'customer',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    email: resource.attributes?.['email'] as string | undefined,
    name: resource.attributes?.['name'] as string | undefined,
    phone: resource.attributes?.['phone'] as string | undefined,
    stripeCustomerId: resource.attributes?.['stripe_customer_id'] as string | undefined,
    mercadopagoCustomerId: resource.attributes?.['mercadopago_customer_id'] as string | undefined,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
