import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Payment } from '../types/payment';
import { parseString, parseDate, parseNumber, parsePaymentStatus } from './utils';

export const paymentMapper: ResourceMapper<Payment> = {
  type: 'Payment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    orderUniqueId: parseString(resource.attributes['order_unique_id']) || '',
    paymentMethod: parseString(resource.attributes['payment_method']) || '',
    paymentProvider: parseString(resource.attributes['payment_provider']) || '',
    transactionId: parseString(resource.attributes['transaction_id']),
    amount: parseNumber(resource.attributes['amount']),
    currency: parseString(resource.attributes['currency']) || 'USD',
    status: parsePaymentStatus(resource.attributes['status']),
    paidAt: parseDate(resource.attributes['paid_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
