# @23blocks/sdk

The complete 23blocks SDK - all blocks in a single package with automatic token management.

[![npm version](https://img.shields.io/npm/v/@23blocks/sdk.svg)](https://www.npmjs.com/package/@23blocks/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/sdk
```

## Overview

This is the recommended package for most users. It provides:

- **All blocks** - Every 23blocks feature in one package
- **Simple client** - Single factory function to create the client
- **Token management** - Automatic token storage and refresh
- **Type safety** - Full TypeScript support

## Quick Start

```typescript
import { create23BlocksClient } from '@23blocks/sdk';

// Create client with service URLs
const client = create23BlocksClient({
  apiKey: 'your-api-key',
  urls: {
    authentication: 'https://auth.yourapp.com',
    // Add other services as needed
    // products: 'https://products.yourapp.com',
    // crm: 'https://crm.yourapp.com',
  },
});

// Sign in - tokens are stored automatically
const { user } = await client.auth.signIn({
  email: 'user@example.com',
  password: 'password',
});
console.log('Welcome', user.email);

// All subsequent requests include auth automatically
const currentUser = await client.auth.getCurrentUser();

// Sign out - tokens are cleared automatically
await client.auth.signOut();
```

## Configuration

### ClientConfig Options

```typescript
const client = create23BlocksClient({
  // Required: Service URLs (only configure what you need)
  urls: {
    authentication: 'https://auth.yourapp.com',
    products: 'https://products.yourapp.com',
    crm: 'https://crm.yourapp.com',
    // ... other services
  },

  // Required: Your API key
  apiKey: 'your-api-key',

  // Optional: Tenant ID for multi-tenant setups
  tenantId: 'tenant-123',

  // Optional: Authentication mode (default: 'token')
  authMode: 'token', // 'token' | 'cookie'

  // Optional: Token storage (default: 'localStorage' in browser, 'memory' in SSR)
  storage: 'localStorage', // 'localStorage' | 'sessionStorage' | 'memory'

  // Optional: Additional headers for every request
  headers: { 'X-Custom-Header': 'value' },

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000,
});
```

### Service URLs

Each microservice has its own URL. Only configure the services you need:

```typescript
interface ServiceUrls {
  authentication?: string;  // Auth, users, roles
  search?: string;          // Search, favorites
  products?: string;        // Products, cart, catalog
  crm?: string;             // Contacts, leads, opportunities
  content?: string;         // CMS posts, comments
  geolocation?: string;     // Addresses, locations
  conversations?: string;   // Messages, notifications
  files?: string;           // File uploads
  forms?: string;           // Form builder
  assets?: string;          // Asset tracking
  campaigns?: string;       // Marketing campaigns
  company?: string;         // Company settings
  rewards?: string;         // Rewards, loyalty
  sales?: string;           // Orders, payments
  wallet?: string;          // Digital wallet
  jarvis?: string;          // AI assistant
  onboarding?: string;      // User onboarding
  university?: string;      // Learning management
}
```

> **Note:** Accessing a service without a configured URL will throw an error with a helpful message.

### Token Mode (Default)

Tokens are stored in browser storage and attached to requests automatically:

```typescript
const client = create23BlocksClient({
  apiKey: 'your-api-key',
  urls: { authentication: 'https://auth.yourapp.com' },
  authMode: 'token',        // default
  storage: 'localStorage',  // default in browser
});
```

### Cookie Mode (Recommended for Security)

Backend manages authentication via httpOnly cookies:

```typescript
const client = create23BlocksClient({
  apiKey: 'your-api-key',
  urls: { authentication: 'https://auth.yourapp.com' },
  authMode: 'cookie',
});
```

### SSR / Server-Side Usage

For server-side rendering, use memory storage and pass tokens manually:

```typescript
const client = create23BlocksClient({
  apiKey: 'your-api-key',
  urls: { authentication: 'https://auth.yourapp.com' },
  storage: 'memory',
  headers: {
    Authorization: `Bearer ${tokenFromRequest}`,
  },
});
```

### Multi-Tenant Setup

```typescript
const client = create23BlocksClient({
  apiKey: 'your-api-key',
  urls: { authentication: 'https://auth.yourapp.com' },
  tenantId: 'tenant-123',
});
```

## Authentication

### Sign In

```typescript
// Required: email, password
const { user, accessToken, refreshToken, expiresIn } = await client.auth.signIn({
  email: 'user@example.com',
  password: 'password',
});

// In token mode, tokens are automatically stored
// In cookie mode, backend sets httpOnly cookies
```

### Sign Up (Registration)

```typescript
// Sign up with required fields only
const { user, accessToken, message } = await client.auth.signUp({
  email: 'new@example.com',         // Required
  password: 'password',              // Required
  passwordConfirmation: 'password',  // Required - must match password
});

// Sign up with optional fields
const { user, accessToken, message } = await client.auth.signUp({
  // Required
  email: 'new@example.com',
  password: 'password',
  passwordConfirmation: 'password',

  // Optional
  name: 'John Doe',
  username: 'johndoe',
  roleId: 'role-uuid',
  confirmSuccessUrl: 'https://yourapp.com/confirmed',  // Redirect after email confirmation
  timeZone: 'America/New_York',
  preferredLanguage: 'en',
  payload: { referralCode: 'ABC123' },  // Custom data
  subscription: 'premium-plan',          // Subscription model ID
});
```

> **Note:** If email confirmation is enabled, `accessToken` will be `undefined`. The user must confirm their email before signing in.

### Sign Out

```typescript
await client.auth.signOut();
// Tokens are automatically cleared (token mode) or cookies invalidated (cookie mode)
```

### Get Current User

```typescript
const user = await client.auth.getCurrentUser();
// Returns user with role, avatar, and profile included
```

### Email Confirmation

```typescript
// Confirm email with token from email link
const user = await client.auth.confirmEmail('confirmation-token');

// Resend confirmation email
await client.auth.resendConfirmation({
  email: 'user@example.com',
  confirmSuccessUrl: 'https://yourapp.com/confirmed',  // Optional
});
```

### Password Reset

```typescript
// Request password reset email
await client.auth.requestPasswordReset({
  email: 'user@example.com',
  redirectUrl: 'https://yourapp.com/reset',  // Optional
});

// Update password with reset token
await client.auth.updatePassword({
  password: 'newPassword',
  passwordConfirmation: 'newPassword',
  resetPasswordToken: 'token-from-email',
});
```

### Token Utilities

```typescript
// Check if authenticated (token mode only, returns null in cookie mode)
const isLoggedIn = client.isAuthenticated();

// Get tokens manually (token mode only)
const accessToken = client.getAccessToken();
const refreshToken = client.getRefreshToken();

// Set tokens manually (useful for SSR hydration)
client.setTokens(accessToken, refreshToken);

// Clear session
client.clearSession();
```

## Available Blocks

The client provides access to all blocks:

| Block | Description |
|-------|-------------|
| `client.auth` | Authentication with managed tokens |
| `client.authentication` | Full authentication block |
| `client.search` | Search and favorites |
| `client.products` | Products, categories, cart |
| `client.crm` | CRM - contacts, accounts, leads |
| `client.content` | CMS - posts, comments |
| `client.geolocation` | Addresses, locations |
| `client.conversations` | Messages, notifications |
| `client.files` | File uploads |
| `client.forms` | Form builder |
| `client.assets` | Asset tracking |
| `client.campaigns` | Marketing campaigns |
| `client.company` | Company settings |
| `client.rewards` | Rewards and loyalty |
| `client.sales` | Orders and payments |
| `client.wallet` | Digital wallet |
| `client.jarvis` | AI assistant |
| `client.onboarding` | User onboarding |
| `client.university` | Learning management |

## Usage Examples

### Products

```typescript
// Requires urls.products to be configured
const { data: products, meta } = await client.products.products.list({
  limit: 20,
  categoryId: 'category-123',
});

// Get product
const product = await client.products.products.get('product-id');

// Add to cart
const cart = await client.products.cart.addItem({
  productId: 'product-id',
  quantity: 2,
});

// Checkout
const order = await client.products.cart.checkout({
  shippingAddressId: 'address-id',
  paymentMethodId: 'payment-id',
});
```

### Search

```typescript
// Requires urls.search to be configured
const { results, totalRecords } = await client.search.search.search({
  query: 'laptop',
  limit: 20,
});

// Suggestions
const suggestions = await client.search.search.suggest('lap', 5);

// Favorites
await client.search.favorites.add({
  entityUniqueId: 'product-123',
  entityType: 'Product',
});

const { data: favorites } = await client.search.favorites.list();
```

### CRM

```typescript
// Requires urls.crm to be configured
const { data: contacts } = await client.crm.contacts.list({ limit: 20 });

// Create lead
const lead = await client.crm.leads.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
});

// Create opportunity
const opp = await client.crm.opportunities.create({
  name: 'Enterprise Deal',
  accountId: 'account-id',
  value: 50000,
});
```

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/sdk';

try {
  await client.auth.signIn({ email, password });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.INVALID_CREDENTIALS:
        console.log('Invalid email or password');
        break;
      case ErrorCodes.UNAUTHORIZED:
        console.log('Session expired');
        break;
      case ErrorCodes.VALIDATION_ERROR:
        console.log('Validation error:', error.message);
        break;
      case ErrorCodes.NETWORK_ERROR:
        console.log('Network error');
        break;
      default:
        console.log(error.message);
    }
  }
}
```

## Advanced: Custom Transport

For advanced users who need custom transport configuration:

```typescript
import { createHttpTransport, createAuthenticationBlock } from '@23blocks/sdk';

const transport = createHttpTransport({
  baseUrl: 'https://auth.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return {
      'api-key': 'your-api-key',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },
  timeout: 60000,
});

const auth = createAuthenticationBlock(transport, {
  apiKey: 'your-api-key',
});

// Use the block directly
const { user } = await auth.auth.signIn({ email, password });
```

## TypeScript

All types are exported and can be used directly:

```typescript
import type {
  // Client types
  Blocks23Client,
  ClientConfig,
  ServiceUrls,
  AuthMode,
  StorageType,

  // Auth types
  User,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,

  // Product types
  Product,
  Cart,

  // Core types
  PageResult,
  BlockError,
} from '@23blocks/sdk';
```

## Framework-Specific Packages

For framework-specific features:

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Injectable services with RxJS
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React hooks and context

## Individual Blocks

If you only need specific functionality, install individual blocks:

```bash
npm install @23blocks/transport-http @23blocks/block-authentication @23blocks/block-search
```

See the [main README](https://github.com/23blocks-OS/frontend-sdk) for the complete list of available packages.

## License

MIT - Copyright (c) 2024 23blocks
