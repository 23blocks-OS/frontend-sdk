# @23blocks/block-sales

Sales block for the 23blocks SDK - orders, payments, and subscriptions.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-sales.svg)](https://www.npmjs.com/package/@23blocks/block-sales)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-sales @23blocks/transport-http
```

## Overview

This package provides sales and order management functionality including:

- **Orders** - Order creation, management, and fulfillment
- **Order Details** - Line item management
- **Payments** - Payment processing and tracking
- **Subscriptions** - Recurring billing management

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createSalesBlock } from '@23blocks/block-sales';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const sales = createSalesBlock(transport, {
  apiKey: 'your-api-key',
});

// List orders
const { data: orders } = await sales.orders.list({
  status: 'pending',
  limit: 20,
});

// Create an order
const order = await sales.orders.create({
  customerId: 'customer-id',
  items: [{ productId: 'prod-1', quantity: 2, price: 29.99 }],
});
```

## Services

### orders - Order Management

```typescript
// List orders
const { data: orders, meta } = await sales.orders.list({
  limit: 20,
  status: 'pending',
  customerId: 'customer-id',
});

// Get order by ID
const order = await sales.orders.get('order-id');

// Create order
const newOrder = await sales.orders.create({
  customerId: 'customer-id',
  shippingAddressId: 'address-id',
  billingAddressId: 'address-id',
  items: [
    { productId: 'prod-1', quantity: 2, price: 29.99 },
    { productId: 'prod-2', quantity: 1, price: 49.99 },
  ],
  couponCode: 'SAVE10',
  notes: 'Please gift wrap',
});

// Update order
await sales.orders.update('order-id', {
  status: 'processing',
  trackingNumber: 'TRACK123',
});

// Cancel order
await sales.orders.update('order-id', {
  status: 'cancelled',
  cancellationReason: 'Customer request',
});

// Delete order
await sales.orders.delete('order-id');
```

### orderDetails - Line Item Management

```typescript
// Get order details
const details = await sales.orderDetails.list({
  orderId: 'order-id',
});

// Update line item
await sales.orderDetails.update('detail-id', {
  quantity: 3,
  price: 27.99,
});

// Remove line item
await sales.orderDetails.delete('detail-id');
```

### payments - Payment Processing

```typescript
// List payments
const { data: payments } = await sales.payments.list({
  orderId: 'order-id',
});

// Get payment by ID
const payment = await sales.payments.get('payment-id');

// Create payment
const newPayment = await sales.payments.create({
  orderId: 'order-id',
  amount: 109.97,
  paymentMethodId: 'pm-id',
  currency: 'USD',
});

// List payments by customer
const { data: customerPayments } = await sales.payments.list({
  customerId: 'customer-id',
  status: 'completed',
});
```

### subscriptions - Recurring Billing

```typescript
// List subscriptions
const { data: subscriptions } = await sales.subscriptions.list({
  customerId: 'customer-id',
  status: 'active',
});

// Get subscription by ID
const subscription = await sales.subscriptions.get('subscription-id');

// Create subscription
const newSubscription = await sales.subscriptions.create({
  customerId: 'customer-id',
  planId: 'plan-id',
  interval: 'monthly',
  startDate: '2024-01-01',
  paymentMethodId: 'pm-id',
});

// Update subscription
await sales.subscriptions.update('subscription-id', {
  planId: 'upgraded-plan-id',
});

// Cancel subscription
await sales.subscriptions.update('subscription-id', {
  status: 'cancelled',
  cancelledAt: new Date().toISOString(),
  cancellationReason: 'Downgrading service',
});

// Pause subscription
await sales.subscriptions.update('subscription-id', {
  status: 'paused',
  pausedUntil: '2024-03-01',
});

// Resume subscription
await sales.subscriptions.update('subscription-id', {
  status: 'active',
});
```

## Types

```typescript
import type {
  Order,
  OrderStatus,
  OrderDetail,
  Payment,
  PaymentStatus,
  Subscription,
  SubscriptionInterval,
  SubscriptionStatus,
  CreateOrderRequest,
  CreatePaymentRequest,
  CreateSubscriptionRequest,
} from '@23blocks/block-sales';
```

### OrderStatus

- `pending` - Order placed, awaiting processing
- `processing` - Order being processed
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled
- `refunded` - Order refunded

### PaymentStatus

- `pending` - Payment pending
- `processing` - Payment processing
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded
- `disputed` - Payment disputed

### SubscriptionStatus

- `active` - Subscription active
- `paused` - Subscription paused
- `cancelled` - Subscription cancelled
- `past_due` - Payment past due
- `expired` - Subscription expired

### SubscriptionInterval

- `daily` - Daily billing
- `weekly` - Weekly billing
- `monthly` - Monthly billing
- `quarterly` - Quarterly billing
- `yearly` - Yearly billing

## Related Packages

- [`@23blocks/block-products`](https://www.npmjs.com/package/@23blocks/block-products) - Product catalog
- [`@23blocks/block-rewards`](https://www.npmjs.com/package/@23blocks/block-rewards) - Coupons and rewards
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
