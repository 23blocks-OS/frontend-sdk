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
  type OrderTax,
  type CreateOrderTaxRequest,
  type UpdateOrderTaxRequest,
  type SubscriptionModel,
  type CreateSubscriptionModelRequest,
  type UpdateSubscriptionModelRequest,
  type ListSubscriptionModelsParams,
  type SalesEntity,
  type RegisterSalesEntityRequest,
  type UpdateSalesEntityRequest,
  type ListSalesEntitiesParams,
  type EntitySubscription,
  type CreateEntitySubscriptionRequest,
  type UpdateEntitySubscriptionRequest,
  type SalesUser,
  type RegisterSalesUserRequest,
  type UpdateSalesUserRequest,
  type ListSalesUsersParams,
  type UserSubscription,
  type CreateUserSubscriptionRequest,
  type UpdateUserSubscriptionRequest,
  type SalesCustomer,
  type CreateSalesCustomerRequest,
  type UpdateSalesCustomerRequest,
  type ListSalesCustomersParams,
  type FlexibleOrder,
  type CreateFlexibleOrderRequest,
  type UpdateFlexibleOrderRequest,
  type ListFlexibleOrdersParams,
  type VendorPayment,
  type CreateVendorPaymentRequest,
  type UpdateVendorPaymentRequest,
  type ListVendorPaymentsParams,
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
  // Order Taxes Service
  // ───────────────────────────────────────────────────────────────────────────

  listOrderTaxes(orderUniqueId: string): Observable<OrderTax[]> {
    return from(this.ensureConfigured().orderTaxes.list(orderUniqueId));
  }

  getOrderTax(orderUniqueId: string, uniqueId: string): Observable<OrderTax> {
    return from(this.ensureConfigured().orderTaxes.get(orderUniqueId, uniqueId));
  }

  createOrderTax(orderUniqueId: string, data: CreateOrderTaxRequest): Observable<OrderTax> {
    return from(this.ensureConfigured().orderTaxes.create(orderUniqueId, data));
  }

  updateOrderTax(orderUniqueId: string, uniqueId: string, data: UpdateOrderTaxRequest): Observable<OrderTax> {
    return from(this.ensureConfigured().orderTaxes.update(orderUniqueId, uniqueId, data));
  }

  deleteOrderTax(orderUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().orderTaxes.delete(orderUniqueId, uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Subscription Models Service
  // ───────────────────────────────────────────────────────────────────────────

  listSubscriptionModels(params?: ListSubscriptionModelsParams): Observable<PageResult<SubscriptionModel>> {
    return from(this.ensureConfigured().subscriptionModels.list(params));
  }

  getSubscriptionModel(uniqueId: string): Observable<SubscriptionModel> {
    return from(this.ensureConfigured().subscriptionModels.get(uniqueId));
  }

  createSubscriptionModel(data: CreateSubscriptionModelRequest): Observable<SubscriptionModel> {
    return from(this.ensureConfigured().subscriptionModels.create(data));
  }

  updateSubscriptionModel(uniqueId: string, data: UpdateSubscriptionModelRequest): Observable<SubscriptionModel> {
    return from(this.ensureConfigured().subscriptionModels.update(uniqueId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Entities Service
  // ───────────────────────────────────────────────────────────────────────────

  listSalesEntities(params?: ListSalesEntitiesParams): Observable<PageResult<SalesEntity>> {
    return from(this.ensureConfigured().entities.list(params));
  }

  getSalesEntity(uniqueId: string): Observable<SalesEntity> {
    return from(this.ensureConfigured().entities.get(uniqueId));
  }

  registerSalesEntity(uniqueId: string, data?: RegisterSalesEntityRequest): Observable<SalesEntity> {
    return from(this.ensureConfigured().entities.register(uniqueId, data));
  }

  updateSalesEntity(uniqueId: string, data: UpdateSalesEntityRequest): Observable<SalesEntity> {
    return from(this.ensureConfigured().entities.update(uniqueId, data));
  }

  createEntitySubscription(uniqueId: string, data: CreateEntitySubscriptionRequest): Observable<EntitySubscription> {
    return from(this.ensureConfigured().entities.createSubscription(uniqueId, data));
  }

  updateEntitySubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateEntitySubscriptionRequest): Observable<EntitySubscription> {
    return from(this.ensureConfigured().entities.updateSubscription(uniqueId, subscriptionUniqueId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Users Service
  // ───────────────────────────────────────────────────────────────────────────

  listSalesUsers(params?: ListSalesUsersParams): Observable<PageResult<SalesUser>> {
    return from(this.ensureConfigured().users.list(params));
  }

  getSalesUser(uniqueId: string): Observable<SalesUser> {
    return from(this.ensureConfigured().users.get(uniqueId));
  }

  registerSalesUser(uniqueId: string, data?: RegisterSalesUserRequest): Observable<SalesUser> {
    return from(this.ensureConfigured().users.register(uniqueId, data));
  }

  updateSalesUser(uniqueId: string, data: UpdateSalesUserRequest): Observable<SalesUser> {
    return from(this.ensureConfigured().users.update(uniqueId, data));
  }

  createSalesUserSubscription(uniqueId: string, data: CreateUserSubscriptionRequest): Observable<UserSubscription> {
    return from(this.ensureConfigured().users.createSubscription(uniqueId, data));
  }

  updateSalesUserSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateUserSubscriptionRequest): Observable<UserSubscription> {
    return from(this.ensureConfigured().users.updateSubscription(uniqueId, subscriptionUniqueId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Customers Service
  // ───────────────────────────────────────────────────────────────────────────

  listSalesCustomers(params?: ListSalesCustomersParams): Observable<PageResult<SalesCustomer>> {
    return from(this.ensureConfigured().customers.list(params));
  }

  getSalesCustomer(uniqueId: string): Observable<SalesCustomer> {
    return from(this.ensureConfigured().customers.get(uniqueId));
  }

  createSalesCustomer(data: CreateSalesCustomerRequest): Observable<SalesCustomer> {
    return from(this.ensureConfigured().customers.create(data));
  }

  updateSalesCustomer(uniqueId: string, data: UpdateSalesCustomerRequest): Observable<SalesCustomer> {
    return from(this.ensureConfigured().customers.update(uniqueId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Flexible Orders Service
  // ───────────────────────────────────────────────────────────────────────────

  listFlexibleOrders(params?: ListFlexibleOrdersParams): Observable<PageResult<FlexibleOrder>> {
    return from(this.ensureConfigured().flexibleOrders.list(params));
  }

  getFlexibleOrder(uniqueId: string): Observable<FlexibleOrder> {
    return from(this.ensureConfigured().flexibleOrders.get(uniqueId));
  }

  createFlexibleOrder(data: CreateFlexibleOrderRequest): Observable<FlexibleOrder> {
    return from(this.ensureConfigured().flexibleOrders.create(data));
  }

  updateFlexibleOrder(uniqueId: string, data: UpdateFlexibleOrderRequest): Observable<FlexibleOrder> {
    return from(this.ensureConfigured().flexibleOrders.update(uniqueId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Vendor Payments Service
  // ───────────────────────────────────────────────────────────────────────────

  listVendorPayments(params?: ListVendorPaymentsParams): Observable<PageResult<VendorPayment>> {
    return from(this.ensureConfigured().vendorPayments.list(params));
  }

  getVendorPayment(uniqueId: string): Observable<VendorPayment> {
    return from(this.ensureConfigured().vendorPayments.get(uniqueId));
  }

  createVendorPayment(data: CreateVendorPaymentRequest): Observable<VendorPayment> {
    return from(this.ensureConfigured().vendorPayments.create(data));
  }

  updateVendorPayment(uniqueId: string, data: UpdateVendorPaymentRequest): Observable<VendorPayment> {
    return from(this.ensureConfigured().vendorPayments.update(uniqueId, data));
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
