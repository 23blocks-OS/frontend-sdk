import type { Transport } from './transport.js';

/**
 * Base configuration for all blocks
 */
export interface BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Block factory function type
 */
export type BlockFactory<TBlock, TConfig extends BlockConfig = BlockConfig> = (
  transport: Transport,
  config: TConfig
) => TBlock;

/**
 * Block metadata
 */
export interface BlockMetadata {
  /** Block name */
  name: string;
  /** Block version */
  version: string;
  /** Block description */
  description?: string;
  /** Resource types managed by this block */
  resourceTypes: string[];
}

/**
 * Block registration entry
 */
export interface BlockRegistration<TBlock = unknown, TConfig extends BlockConfig = BlockConfig> {
  /** Block metadata */
  metadata: BlockMetadata;
  /** Block factory function */
  factory: BlockFactory<TBlock, TConfig>;
}
