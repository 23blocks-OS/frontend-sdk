import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createSalesBlock,
  type SalesBlock,
  type SalesBlockConfig,
  type Order,
  type OrderStatus,
  type CreateOrderRequest,
  type UpdateOrderRequest,
  type ListOrdersParams,
  type OrderDetail,
  type UpdateOrderDetailRequest,
  type Payment,
  type PaymentStatus,
  type CreatePaymentRequest,
  type ListPaymentsParams,
  type Subscription,
  type SubscriptionInterval,
  type SubscriptionStatus,
  type CreateSubscriptionRequest,
  type UpdateSubscriptionRequest,
  type ListSubscriptionsParams,
} from '@23blocks/block-sales';
import { TRANSPORT, SALES_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Sales block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CheckoutComponent {
 *   constructor(private sales: SalesService) {}
 *
 *   createOrder(items: any[]) {
 *     this.sales.createOrder({ userUniqueId: '123', items }).subscribe({
 *       next: (order) => console.log('Order created:', order),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly block: SalesBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(SALES_CONFIG) config: SalesBlockConfig
  ) {
    this.block = createSalesBlock(transport, config);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Orders Service
  // ───────────────────────────────────────────────────────────────────────────

  listOrders(params?: ListOrdersParams): Observable<PageResult<Order>> {
    return from(this.block.orders.list(params));
  }

  getOrder(uniqueId: string): Observable<Order> {
    return from(this.block.orders.get(uniqueId));
  }

  createOrder(data: CreateOrderRequest): Observable<Order> {
    return from(this.block.orders.create(data));
  }

  updateOrder(uniqueId: string, data: UpdateOrderRequest): Observable<Order> {
    return from(this.block.orders.update(uniqueId, data));
  }

  cancelOrder(uniqueId: string): Observable<Order> {
    return from(this.block.orders.cancel(uniqueId));
  }

  confirmOrder(uniqueId: string): Observable<Order> {
    return from(this.block.orders.confirm(uniqueId));
  }

  shipOrder(uniqueId: string, trackingNumber?: string): Observable<Order> {
    return from(this.block.orders.ship(uniqueId, trackingNumber));
  }

  deliverOrder(uniqueId: string): Observable<Order> {
    return from(this.block.orders.deliver(uniqueId));
  }

  listOrdersByUser(userUniqueId: string, params?: ListOrdersParams): Observable<PageResult<Order>> {
    return from(this.block.orders.listByUser(userUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Order Details Service
  // ───────────────────────────────────────────────────────────────────────────

  listOrderDetails(): Observable<OrderDetail[]> {
    return from(this.block.orderDetails.list());
  }

  getOrderDetail(uniqueId: string): Observable<OrderDetail> {
    return from(this.block.orderDetails.get(uniqueId));
  }

  updateOrderDetail(uniqueId: string, data: UpdateOrderDetailRequest): Observable<OrderDetail> {
    return from(this.block.orderDetails.update(uniqueId, data));
  }

  listOrderDetailsByOrder(orderUniqueId: string): Observable<OrderDetail[]> {
    return from(this.block.orderDetails.listByOrder(orderUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Payments Service
  // ───────────────────────────────────────────────────────────────────────────

  listPayments(params?: ListPaymentsParams): Observable<PageResult<Payment>> {
    return from(this.block.payments.list(params));
  }

  getPayment(uniqueId: string): Observable<Payment> {
    return from(this.block.payments.get(uniqueId));
  }

  createPayment(data: CreatePaymentRequest): Observable<Payment> {
    return from(this.block.payments.create(data));
  }

  refundPayment(uniqueId: string, amount?: number): Observable<Payment> {
    return from(this.block.payments.refund(uniqueId, amount));
  }

  listPaymentsByOrder(orderUniqueId: string): Observable<Payment[]> {
    return from(this.block.payments.listByOrder(orderUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Subscriptions Service
  // ───────────────────────────────────────────────────────────────────────────

  listSubscriptions(params?: ListSubscriptionsParams): Observable<PageResult<Subscription>> {
    return from(this.block.subscriptions.list(params));
  }

  getSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.block.subscriptions.get(uniqueId));
  }

  createSubscription(data: CreateSubscriptionRequest): Observable<Subscription> {
    return from(this.block.subscriptions.create(data));
  }

  updateSubscription(uniqueId: string, data: UpdateSubscriptionRequest): Observable<Subscription> {
    return from(this.block.subscriptions.update(uniqueId, data));
  }

  cancelSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.block.subscriptions.cancel(uniqueId));
  }

  pauseSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.block.subscriptions.pause(uniqueId));
  }

  resumeSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.block.subscriptions.resume(uniqueId));
  }

  listSubscriptionsByUser(userUniqueId: string, params?: ListSubscriptionsParams): Observable<PageResult<Subscription>> {
    return from(this.block.subscriptions.listByUser(userUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): SalesBlock {
    return this.block;
  }
}
