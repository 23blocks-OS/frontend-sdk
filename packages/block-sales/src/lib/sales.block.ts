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
  createPurchasesService,
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
  type PurchasesService,
} from './services/index.js';

/**
 * Configuration for the Sales block.
 */
export interface SalesBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Sales, orders, and payment management block interface.
 */
export interface SalesBlock {
  /** Order CRUD operations */
  orders: OrdersService;
  /** Order line-item detail management */
  orderDetails: OrderDetailsService;
  /** Order tax management */
  orderTaxes: OrderTaxesService;
  /** Payment processing */
  payments: PaymentsService;
  /** Subscription management */
  subscriptions: SubscriptionsService;
  /** Subscription model definition management */
  subscriptionModels: SubscriptionModelsService;
  /** Sales entity management */
  entities: SalesEntitiesService;
  /** Sales user management */
  users: SalesUsersService;
  /** Sales customer management */
  customers: SalesCustomersService;
  /** Flexible order management */
  flexibleOrders: FlexibleOrdersService;
  /** Stripe payment integration */
  stripe: StripeService;
  /** MercadoPago payment integration */
  mercadopago: MercadoPagoService;
  /** Vendor payment management */
  vendorPayments: VendorPaymentsService;
  /** Gateway-agnostic single-call purchases (Order + Payment + Subscription) */
  purchases: PurchasesService;
}

/**
 * Create the Sales block.
 *
 * @example
 * ```typescript
 * const block = createSalesBlock(transport, { appId: 'xxx' });
 * const orders = await block.orders.list({ page: 1 });
 * ```
 */
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
    purchases: createPurchasesService(transport, config),
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
