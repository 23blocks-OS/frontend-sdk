# @23blocks/block-products

Products block for the 23blocks SDK - product catalog, cart, categories, and inventory management.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-products.svg)](https://www.npmjs.com/package/@23blocks/block-products)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-products @23blocks/transport-http
```

## Overview

This package provides comprehensive e-commerce functionality including:

- **Products** - Product CRUD, variations, images, stock, reviews
- **Cart** - Shopping cart management and checkout
- **Categories** - Category hierarchy and organization
- **Brands** - Brand management
- **Vendors** - Vendor/supplier management
- **Warehouses** - Inventory locations
- **Channels** - Sales channels
- **Collections** - Product collections/groups

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createProductsBlock } from '@23blocks/block-products';

// Create transport
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

// Create block
const products = createProductsBlock(transport, {
  apiKey: 'your-api-key',
});

// List products
const { data: productList, meta } = await products.products.list({
  limit: 20,
  categoryId: 'category-123',
});

productList.forEach((product) => {
  console.log(product.name, product.price);
});
```

## Services

### products - Product Management

```typescript
// List products with filtering
const { data: productList, meta } = await products.products.list({
  limit: 20,
  offset: 0,
  categoryId: 'category-id',
  brandId: 'brand-id',
  status: 'active',
});

// Get product by ID
const product = await products.products.get('product-id');

// Create product
const newProduct = await products.products.create({
  name: 'New Product',
  description: 'Product description',
  price: 99.99,
  categoryId: 'category-id',
  brandId: 'brand-id',
  sku: 'SKU-001',
  status: 'active',
});

// Update product
const updated = await products.products.update('product-id', {
  price: 89.99,
  status: 'on_sale',
});

// Delete product
await products.products.delete('product-id');

// Product variations
const { data: variations } = await products.products.listVariations('product-id');

const variation = await products.products.createVariation('product-id', {
  name: 'Size Large',
  sku: 'SKU-001-L',
  price: 99.99,
  attributes: { size: 'L', color: 'Blue' },
});

await products.products.updateVariation('product-id', 'variation-id', {
  price: 94.99,
});

await products.products.deleteVariation('product-id', 'variation-id');

// Product images
const { data: images } = await products.products.listImages('product-id');

// Product stock
const { data: stock } = await products.products.getStock('product-id');

// Product reviews
const { data: reviews } = await products.products.listReviews('product-id');
```

### cart - Shopping Cart

```typescript
// Get current cart
const cart = await products.cart.get();

// Add item to cart
const updatedCart = await products.cart.addItem({
  productId: 'product-id',
  variationId: 'variation-id', // optional
  quantity: 2,
});

// Update cart item quantity
const cart = await products.cart.updateItem('cart-item-id', {
  quantity: 3,
});

// Remove item from cart
await products.cart.removeItem('cart-item-id');

// Clear cart
await products.cart.clear();

// Update cart (coupon, shipping, etc.)
const cart = await products.cart.update({
  couponCode: 'SAVE10',
  shippingMethodId: 'shipping-method-id',
});

// Checkout
const order = await products.cart.checkout({
  shippingAddressId: 'address-id',
  billingAddressId: 'address-id',
  paymentMethodId: 'payment-method-id',
});
```

### categories - Category Management

```typescript
// List categories
const { data: categories } = await products.categories.list({
  parentId: null, // Get root categories
});

// Get category tree
const tree = await products.categories.getTree();

// Get category by ID
const category = await products.categories.get('category-id');

// Create category
const newCategory = await products.categories.create({
  name: 'Electronics',
  description: 'Electronic devices',
  parentId: null,
  slug: 'electronics',
});

// Update category
const updated = await products.categories.update('category-id', {
  name: 'Consumer Electronics',
});

// Delete category
await products.categories.delete('category-id');
```

### brands - Brand Management

```typescript
// List brands
const { data: brands } = await products.brands.list();

// Get brand by ID
const brand = await products.brands.get('brand-id');

// Create brand
const newBrand = await products.brands.create({
  name: 'Apple',
  description: 'Technology company',
  logoUrl: 'https://example.com/logo.png',
});

// Update brand
const updated = await products.brands.update('brand-id', {
  description: 'Updated description',
});

// Delete brand
await products.brands.delete('brand-id');
```

### vendors - Vendor Management

```typescript
// List vendors
const { data: vendors } = await products.vendors.list();

// Get vendor by ID
const vendor = await products.vendors.get('vendor-id');

// Create vendor
const newVendor = await products.vendors.create({
  name: 'Acme Corp',
  email: 'contact@acme.com',
  phoneNumber: '+1234567890',
});

// Update vendor
const updated = await products.vendors.update('vendor-id', {
  email: 'new@acme.com',
});

// Delete vendor
await products.vendors.delete('vendor-id');
```

### warehouses - Warehouse Management

```typescript
// List warehouses
const { data: warehouses } = await products.warehouses.list();

// Get warehouse by ID
const warehouse = await products.warehouses.get('warehouse-id');

// Create warehouse
const newWarehouse = await products.warehouses.create({
  name: 'Main Warehouse',
  address: '123 Main St',
  city: 'New York',
  country: 'US',
});

// Update warehouse
const updated = await products.warehouses.update('warehouse-id', {
  name: 'Primary Warehouse',
});

// Delete warehouse
await products.warehouses.delete('warehouse-id');
```

### channels - Sales Channels

```typescript
// List channels
const { data: channels } = await products.channels.list();

// Get channel by ID
const channel = await products.channels.get('channel-id');
```

### collections - Product Collections

```typescript
// List collections
const { data: collections } = await products.collections.list();

// Get collection by ID
const collection = await products.collections.get('collection-id');

// Get products in collection
const { data: collectionProducts } = await products.collections.getProducts('collection-id');
```

## Types

```typescript
import type {
  // Product types
  Product,
  ProductVariation,
  ProductImage,
  ProductStock,
  ProductReview,
  CreateProductRequest,
  UpdateProductRequest,

  // Cart types
  Cart,
  CartDetail,
  AddToCartRequest,
  CheckoutRequest,

  // Catalog types
  Category,
  Brand,
  Vendor,
  Warehouse,
  Channel,
  Collection,
} from '@23blocks/block-products';
```

### Product

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Product ID |
| `uniqueId` | `string` | Unique identifier |
| `name` | `string` | Product name |
| `description` | `string` | Product description |
| `price` | `number` | Base price |
| `compareAtPrice` | `number` | Original price (for sales) |
| `sku` | `string` | Stock keeping unit |
| `status` | `string` | Product status |
| `categoryId` | `string` | Category ID |
| `brandId` | `string` | Brand ID |
| `images` | `ProductImage[]` | Product images |
| `variations` | `ProductVariation[]` | Product variations |

### Cart

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Cart ID |
| `items` | `CartDetail[]` | Cart items |
| `subtotal` | `number` | Subtotal before discounts |
| `discount` | `number` | Total discounts |
| `tax` | `number` | Tax amount |
| `shipping` | `number` | Shipping cost |
| `total` | `number` | Final total |
| `couponCode` | `string` | Applied coupon |

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await products.cart.checkout(checkoutData);
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.VALIDATION_ERROR:
        console.log('Invalid checkout data');
        break;
      case ErrorCodes.NOT_FOUND:
        console.log('Product or cart not found');
        break;
      case 'INSUFFICIENT_STOCK':
        console.log('Not enough stock available');
        break;
    }
  }
}
```

## Related Packages

- [`@23blocks/block-sales`](https://www.npmjs.com/package/@23blocks/block-sales) - Orders and invoices
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
