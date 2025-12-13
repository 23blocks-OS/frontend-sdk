import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createOrdersService,
  createOrderDetailsService,
  createPaymentsService,
  createSubscriptionsService,
  type OrdersService,
  type OrderDetailsService,
  type PaymentsService,
  type SubscriptionsService,
} from './services';

export interface SalesBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface SalesBlock {
  orders: OrdersService;
  orderDetails: OrderDetailsService;
  payments: PaymentsService;
  subscriptions: SubscriptionsService;
}

export function createSalesBlock(
  transport: Transport,
  config: SalesBlockConfig
): SalesBlock {
  return {
    orders: createOrdersService(transport, config),
    orderDetails: createOrderDetailsService(transport, config),
    payments: createPaymentsService(transport, config),
    subscriptions: createSubscriptionsService(transport, config),
  };
}

export const salesBlockMetadata: BlockMetadata = {
  name: 'sales',
  version: '0.1.0',
  description: 'Sales management - orders, payments, subscriptions, and transactions',
  resourceTypes: [
    'Order',
    'OrderDetail',
    'Payment',
    'Subscription',
  ],
};
