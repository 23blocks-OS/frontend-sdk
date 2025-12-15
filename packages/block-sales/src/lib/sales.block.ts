import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createOrdersService,
  createOrderDetailsService,
  createOrderTaxesService,
  createPaymentsService,
  createSubscriptionsService,
  createSubscriptionModelsService,
  createSalesEntitiesService,
  createSalesUsersService,
  createSalesCustomersService,
  createFlexibleOrdersService,
  createStripeService,
  createMercadoPagoService,
  createVendorPaymentsService,
  type OrdersService,
  type OrderDetailsService,
  type OrderTaxesService,
  type PaymentsService,
  type SubscriptionsService,
  type SubscriptionModelsService,
  type SalesEntitiesService,
  type SalesUsersService,
  type SalesCustomersService,
  type FlexibleOrdersService,
  type StripeService,
  type MercadoPagoService,
  type VendorPaymentsService,
} from './services';

export interface SalesBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface SalesBlock {
  orders: OrdersService;
  orderDetails: OrderDetailsService;
  orderTaxes: OrderTaxesService;
  payments: PaymentsService;
  subscriptions: SubscriptionsService;
  subscriptionModels: SubscriptionModelsService;
  entities: SalesEntitiesService;
  users: SalesUsersService;
  customers: SalesCustomersService;
  flexibleOrders: FlexibleOrdersService;
  stripe: StripeService;
  mercadopago: MercadoPagoService;
  vendorPayments: VendorPaymentsService;
}

export function createSalesBlock(
  transport: Transport,
  config: SalesBlockConfig
): SalesBlock {
  return {
    orders: createOrdersService(transport, config),
    orderDetails: createOrderDetailsService(transport, config),
    orderTaxes: createOrderTaxesService(transport, config),
    payments: createPaymentsService(transport, config),
    subscriptions: createSubscriptionsService(transport, config),
    subscriptionModels: createSubscriptionModelsService(transport, config),
    entities: createSalesEntitiesService(transport, config),
    users: createSalesUsersService(transport, config),
    customers: createSalesCustomersService(transport, config),
    flexibleOrders: createFlexibleOrdersService(transport, config),
    stripe: createStripeService(transport, config),
    mercadopago: createMercadoPagoService(transport, config),
    vendorPayments: createVendorPaymentsService(transport, config),
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
