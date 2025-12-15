import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createWalletsService,
  createTransactionsService,
  createAuthorizationCodesService,
  createWebhooksService,
  type WalletsService,
  type TransactionsService,
  type AuthorizationCodesService,
  type WebhooksService,
} from './services';

export interface WalletBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface WalletBlock {
  wallets: WalletsService;
  transactions: TransactionsService;
  authorizationCodes: AuthorizationCodesService;
  webhooks: WebhooksService;
}

export function createWalletBlock(
  transport: Transport,
  config: WalletBlockConfig
): WalletBlock {
  return {
    wallets: createWalletsService(transport, config),
    transactions: createTransactionsService(transport, config),
    authorizationCodes: createAuthorizationCodesService(transport, config),
    webhooks: createWebhooksService(transport, config),
  };
}

export const walletBlockMetadata: BlockMetadata = {
  name: 'wallet',
  version: '0.1.0',
  description: 'Digital wallet management, transactions, and authorization codes',
  resourceTypes: [
    'Wallet',
    'Transaction',
    'AuthorizationCode',
  ],
};
