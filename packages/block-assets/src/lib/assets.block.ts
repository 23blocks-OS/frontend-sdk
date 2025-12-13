import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createAssetsService,
  createAssetEventsService,
  createAssetAuditsService,
  type AssetsService,
  type AssetEventsService,
  type AssetAuditsService,
} from './services';

export interface AssetsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface AssetsBlock {
  assets: AssetsService;
  events: AssetEventsService;
  audits: AssetAuditsService;
}

export function createAssetsBlock(
  transport: Transport,
  config: AssetsBlockConfig
): AssetsBlock {
  return {
    assets: createAssetsService(transport, config),
    events: createAssetEventsService(transport, config),
    audits: createAssetAuditsService(transport, config),
  };
}

export const assetsBlockMetadata: BlockMetadata = {
  name: 'assets',
  version: '0.1.0',
  description: 'Asset management, tracking, events, and audits',
  resourceTypes: [
    'Asset',
    'AssetEvent',
    'AssetAudit',
  ],
};
