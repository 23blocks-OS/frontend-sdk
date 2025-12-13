// Block factory and metadata
export { createSalesBlock, salesBlockMetadata } from './lib/sales.block';
export type { SalesBlock, SalesBlockConfig } from './lib/sales.block';

// Types
export type {
  // Order types
  Order,
  OrderStatus,
  CreateOrderRequest,
  UpdateOrderRequest,
  ListOrdersParams,
  // Order detail types
  OrderDetail,
  UpdateOrderDetailRequest,
  // Payment types
  Payment,
  PaymentStatus,
  CreatePaymentRequest,
  ListPaymentsParams,
  // Subscription types
  Subscription,
  SubscriptionInterval,
  SubscriptionStatus,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  ListSubscriptionsParams,
} from './lib/types';

// Services
export type {
  OrdersService,
  OrderDetailsService,
  PaymentsService,
  SubscriptionsService,
} from './lib/services';

export {
  createOrdersService,
  createOrderDetailsService,
  createPaymentsService,
  createSubscriptionsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  orderMapper,
  orderDetailMapper,
  paymentMapper,
  subscriptionMapper,
} from './lib/mappers';
