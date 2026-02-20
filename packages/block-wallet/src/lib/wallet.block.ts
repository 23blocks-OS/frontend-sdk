import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
  createWalletsService,
  createTransactionsService,
  createAuthorizationCodesService,
  createWebhooksService,
  type WalletsService,
  type TransactionsService,
  type AuthorizationCodesService,
  type WebhooksService,
} from './services/index.js';

/**
 * Configuration for the Wallet block.
 */
export interface WalletBlockConfig extends BlockConfig {
}

/**
 * Digital wallet and transaction management block interface.
 */
export interface WalletBlock {
  /** Wallet CRUD operations */
  wallets: WalletsService;
  /** Transaction management */
  transactions: TransactionsService;
  /** Authorization code management */
  authorizationCodes: AuthorizationCodesService;
  /** Webhook management */
  webhooks: WebhooksService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Wallet block.
 *
 * @example
 * ```typescript
 * const block = createWalletBlock(transport, { apiKey: 'xxx' });
 * const wallets = await block.wallets.list({ page: 1 });
 * ```
 */
export function createWalletBlock(
  transport: Transport,
  config: WalletBlockConfig
): WalletBlock {
  return {
    wallets: createWalletsService(transport, config),
    transactions: createTransactionsService(transport, config),
    authorizationCodes: createAuthorizationCodesService(transport, config),
    webhooks: createWebhooksService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
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
