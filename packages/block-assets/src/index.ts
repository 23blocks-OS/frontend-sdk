// Block factory and metadata
export { createAssetsBlock, assetsBlockMetadata } from './lib/assets.block';
export type { AssetsBlock, AssetsBlockConfig } from './lib/assets.block';

// Types
export type {
  // Asset types
  Asset,
  CreateAssetRequest,
  UpdateAssetRequest,
  ListAssetsParams,
  TransferAssetRequest,
  AssignAssetRequest,
  // Asset Event types
  AssetEvent,
  AssetEventType,
  CreateAssetEventRequest,
  UpdateAssetEventRequest,
  ListAssetEventsParams,
  // Asset Audit types
  AssetAudit,
  CreateAssetAuditRequest,
  UpdateAssetAuditRequest,
  ListAssetAuditsParams,
} from './lib/types';

// Services
export type {
  AssetsService,
  AssetEventsService,
  AssetAuditsService,
} from './lib/services';

export {
  createAssetsService,
  createAssetEventsService,
  createAssetAuditsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  assetMapper,
  assetEventMapper,
  assetAuditMapper,
} from './lib/mappers';
