import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Transaction } from '../types/transaction';
import { parseString, parseDate, parseNumber, parseStatus, parseTransactionType } from './utils';

export const transactionMapper: ResourceMapper<Transaction> = {
  type: 'Transaction',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    walletUniqueId: parseString(resource.attributes['wallet_unique_id']) || '',
    type: parseTransactionType(resource.attributes['type']),
    amount: parseNumber(resource.attributes['amount']),
    currency: parseString(resource.attributes['currency']) || 'USD',
    description: parseString(resource.attributes['description']),
    referenceType: parseString(resource.attributes['reference_type']),
    referenceUniqueId: parseString(resource.attributes['reference_unique_id']),
    balanceBefore: parseNumber(resource.attributes['balance_before']),
    balanceAfter: parseNumber(resource.attributes['balance_after']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
