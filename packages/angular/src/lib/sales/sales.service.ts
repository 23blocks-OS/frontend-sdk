import { Injectable, Inject, Optional } from '@angular/core';
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
import { TRANSPORT, SALES_TRANSPORT, SALES_CONFIG } from '../tokens.js';

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
  private readonly block: SalesBlock | null;

  constructor(
    @Optional() @Inject(SALES_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(SALES_CONFIG) config: SalesBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createSalesBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): SalesBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] SalesService is not configured. ' +
        "Add 'urls.sales' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Orders Service
  // ───────────────────────────────────────────────────────────────────────────

  listOrders(params?: ListOrdersParams): Observable<PageResult<Order>> {
    return from(this.ensureConfigured().orders.list(params));
  }

  getOrder(uniqueId: string): Observable<Order> {
    return from(this.ensureConfigured().orders.get(uniqueId));
  }

  createOrder(data: CreateOrderRequest): Observable<Order> {
    return from(this.ensureConfigured().orders.create(data));
  }

  updateOrder(uniqueId: string, data: UpdateOrderRequest): Observable<Order> {
    return from(this.ensureConfigured().orders.update(uniqueId, data));
  }

  cancelOrder(uniqueId: string): Observable<Order> {
    return from(this.ensureConfigured().orders.cancel(uniqueId));
  }

  confirmOrder(uniqueId: string): Observable<Order> {
    return from(this.ensureConfigured().orders.confirm(uniqueId));
  }

  shipOrder(uniqueId: string, trackingNumber?: string): Observable<Order> {
    return from(this.ensureConfigured().orders.ship(uniqueId, trackingNumber));
  }

  deliverOrder(uniqueId: string): Observable<Order> {
    return from(this.ensureConfigured().orders.deliver(uniqueId));
  }

  listOrdersByUser(userUniqueId: string, params?: ListOrdersParams): Observable<PageResult<Order>> {
    return from(this.ensureConfigured().orders.listByUser(userUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Order Details Service
  // ───────────────────────────────────────────────────────────────────────────

  listOrderDetails(): Observable<OrderDetail[]> {
    return from(this.ensureConfigured().orderDetails.list());
  }

  getOrderDetail(uniqueId: string): Observable<OrderDetail> {
    return from(this.ensureConfigured().orderDetails.get(uniqueId));
  }

  updateOrderDetail(uniqueId: string, data: UpdateOrderDetailRequest): Observable<OrderDetail> {
    return from(this.ensureConfigured().orderDetails.update(uniqueId, data));
  }

  listOrderDetailsByOrder(orderUniqueId: string): Observable<OrderDetail[]> {
    return from(this.ensureConfigured().orderDetails.listByOrder(orderUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Payments Service
  // ───────────────────────────────────────────────────────────────────────────

  listPayments(params?: ListPaymentsParams): Observable<PageResult<Payment>> {
    return from(this.ensureConfigured().payments.list(params));
  }

  getPayment(uniqueId: string): Observable<Payment> {
    return from(this.ensureConfigured().payments.get(uniqueId));
  }

  createPayment(data: CreatePaymentRequest): Observable<Payment> {
    return from(this.ensureConfigured().payments.create(data));
  }

  refundPayment(uniqueId: string, amount?: number): Observable<Payment> {
    return from(this.ensureConfigured().payments.refund(uniqueId, amount));
  }

  listPaymentsByOrder(orderUniqueId: string): Observable<Payment[]> {
    return from(this.ensureConfigured().payments.listByOrder(orderUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Subscriptions Service
  // ───────────────────────────────────────────────────────────────────────────

  listSubscriptions(params?: ListSubscriptionsParams): Observable<PageResult<Subscription>> {
    return from(this.ensureConfigured().subscriptions.list(params));
  }

  getSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.get(uniqueId));
  }

  createSubscription(data: CreateSubscriptionRequest): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.create(data));
  }

  updateSubscription(uniqueId: string, data: UpdateSubscriptionRequest): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.update(uniqueId, data));
  }

  cancelSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.cancel(uniqueId));
  }

  pauseSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.pause(uniqueId));
  }

  resumeSubscription(uniqueId: string): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.resume(uniqueId));
  }

  listSubscriptionsByUser(userUniqueId: string, params?: ListSubscriptionsParams): Observable<PageResult<Subscription>> {
    return from(this.ensureConfigured().subscriptions.listByUser(userUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): SalesBlock {
    return this.ensureConfigured();
  }
}
