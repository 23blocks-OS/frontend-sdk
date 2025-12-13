// Block factory and metadata
export { createWalletBlock, walletBlockMetadata } from './lib/wallet.block';
export type { WalletBlock, WalletBlockConfig } from './lib/wallet.block';

// Types
export type {
  // Wallet types
  Wallet,
  CreateWalletRequest,
  UpdateWalletRequest,
  ListWalletsParams,
  CreditWalletRequest,
  DebitWalletRequest,
  // Transaction types
  Transaction,
  TransactionType,
  ListTransactionsParams,
  // Authorization code types
  AuthorizationCode,
  CreateAuthorizationCodeRequest,
  ValidateAuthorizationCodeRequest,
  UseAuthorizationCodeRequest,
  ListAuthorizationCodesParams,
} from './lib/types';

// Services
export type {
  WalletsService,
  TransactionsService,
  AuthorizationCodesService,
} from './lib/services';

export {
  createWalletsService,
  createTransactionsService,
  createAuthorizationCodesService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  walletMapper,
  transactionMapper,
  authorizationCodeMapper,
} from './lib/mappers';
