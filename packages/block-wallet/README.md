# @23blocks/block-wallet

Wallet block for the 23blocks SDK - digital wallets, transactions, and authorization codes.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-wallet.svg)](https://www.npmjs.com/package/@23blocks/block-wallet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-wallet @23blocks/transport-http
```

## Overview

This package provides digital wallet functionality including:

- **Wallets** - Digital wallet management with balance operations
- **Transactions** - Transaction history and tracking
- **Authorization Codes** - One-time codes for secure transactions

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createWalletBlock } from '@23blocks/block-wallet';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const wallet = createWalletBlock(transport, {
  apiKey: 'your-api-key',
});

// Get user's wallet
const userWallet = await wallet.wallets.getByUser('user-id');
console.log('Balance:', userWallet.balance);

// Credit wallet
await wallet.wallets.credit('wallet-id', {
  amount: 50,
  reason: 'Referral bonus',
});
```

## Services

### wallets - Wallet Management

```typescript
// List wallets
const { data: wallets } = await wallet.wallets.list({
  limit: 20,
  status: 'active',
});

// Get wallet by ID
const w = await wallet.wallets.get('wallet-id');

// Get wallet by user
const userWallet = await wallet.wallets.getByUser('user-id');

// Create wallet
const newWallet = await wallet.wallets.create({
  userId: 'user-id',
  currency: 'USD',
  initialBalance: 0,
});

// Update wallet
await wallet.wallets.update('wallet-id', {
  status: 'frozen',
  frozenReason: 'Suspicious activity',
});

// Credit wallet (add funds)
await wallet.wallets.credit('wallet-id', {
  amount: 100,
  reason: 'deposit',
  referenceId: 'payment-123',
  notes: 'Bank transfer deposit',
});

// Debit wallet (remove funds)
await wallet.wallets.debit('wallet-id', {
  amount: 25,
  reason: 'purchase',
  referenceId: 'order-456',
  notes: 'Product purchase',
});

// Delete wallet
await wallet.wallets.delete('wallet-id');
```

### transactions - Transaction History

```typescript
// List transactions
const { data: transactions, meta } = await wallet.transactions.list({
  walletId: 'wallet-id',
  limit: 50,
});

transactions.forEach((tx) => {
  console.log(tx.type, tx.amount, tx.reason, tx.createdAt);
});

// Get transaction by ID
const transaction = await wallet.transactions.get('transaction-id');

// Filter transactions by type
const credits = await wallet.transactions.list({
  walletId: 'wallet-id',
  type: 'credit',
});

const debits = await wallet.transactions.list({
  walletId: 'wallet-id',
  type: 'debit',
});

// Filter by date range
const recent = await wallet.transactions.list({
  walletId: 'wallet-id',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});
```

### authorizationCodes - Secure Transaction Codes

```typescript
// List authorization codes
const { data: codes } = await wallet.authorizationCodes.list({
  walletId: 'wallet-id',
  status: 'active',
});

// Get code by ID
const code = await wallet.authorizationCodes.get('code-id');

// Create authorization code
const newCode = await wallet.authorizationCodes.create({
  walletId: 'wallet-id',
  amount: 50,
  expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
  singleUse: true,
  purpose: 'in_store_payment',
});

console.log('Code:', newCode.code);
console.log('Expires:', newCode.expiresAt);

// Validate code
const validation = await wallet.authorizationCodes.validate({
  code: 'ABC123',
  walletId: 'wallet-id',
});

if (validation.valid) {
  console.log('Code is valid for amount:', validation.amount);
} else {
  console.log('Invalid code:', validation.error);
}

// Use authorization code (debit wallet)
await wallet.authorizationCodes.use({
  code: 'ABC123',
  walletId: 'wallet-id',
  merchantId: 'merchant-123',
  referenceId: 'purchase-789',
});

// Void unused code
await wallet.authorizationCodes.void('code-id');
```

## Types

```typescript
import type {
  Wallet,
  Transaction,
  TransactionType,
  AuthorizationCode,
  CreateWalletRequest,
  CreditWalletRequest,
  DebitWalletRequest,
  CreateAuthorizationCodeRequest,
  ValidateAuthorizationCodeRequest,
  UseAuthorizationCodeRequest,
  ListTransactionsParams,
} from '@23blocks/block-wallet';
```

### Wallet

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Wallet ID |
| `userId` | `string` | Owner user ID |
| `balance` | `number` | Current balance |
| `currency` | `string` | Currency code |
| `status` | `string` | active, frozen, closed |

### Transaction

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Transaction ID |
| `walletId` | `string` | Wallet ID |
| `type` | `TransactionType` | credit or debit |
| `amount` | `number` | Transaction amount |
| `balanceAfter` | `number` | Balance after transaction |
| `reason` | `string` | Transaction reason |
| `referenceId` | `string` | External reference |
| `createdAt` | `Date` | Transaction timestamp |

### TransactionType

- `credit` - Funds added to wallet
- `debit` - Funds removed from wallet

### AuthorizationCode

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Code ID |
| `code` | `string` | The authorization code |
| `walletId` | `string` | Associated wallet |
| `amount` | `number` | Authorized amount |
| `status` | `string` | active, used, expired, voided |
| `expiresAt` | `Date` | Expiration timestamp |
| `singleUse` | `boolean` | One-time use only |

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await wallet.wallets.debit('wallet-id', { amount: 1000 });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case 'INSUFFICIENT_BALANCE':
        console.log('Not enough funds in wallet');
        break;
      case 'WALLET_FROZEN':
        console.log('Wallet is frozen');
        break;
      case ErrorCodes.NOT_FOUND:
        console.log('Wallet not found');
        break;
    }
  }
}
```

## Related Packages

- [`@23blocks/block-sales`](https://www.npmjs.com/package/@23blocks/block-sales) - Orders and payments
- [`@23blocks/block-rewards`](https://www.npmjs.com/package/@23blocks/block-rewards) - Rewards and loyalty
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
