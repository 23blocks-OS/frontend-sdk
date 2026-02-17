import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
  createAssetsService,
  createAssetEventsService,
  createAssetAuditsService,
  createCategoriesService,
  createTagsService,
  createVendorsService,
  createWarehousesService,
  createAssetsEntitiesService,
  createAssetOperationsService,
  createAlertsService,
  createAssetsUsersService,
  createAssetImagesService,
  type AssetsService,
  type AssetEventsService,
  type AssetAuditsService,
  type CategoriesService,
  type TagsService,
  type VendorsService,
  type WarehousesService,
  type AssetsEntitiesService,
  type AssetOperationsService,
  type AlertsService,
  type AssetsUsersService,
  type AssetImagesService,
} from './services/index.js';

/**
 * Configuration for the Assets block.
 */
export interface AssetsBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Asset management block interface.
 */
export interface AssetsBlock {
  /** Core asset CRUD operations */
  assets: AssetsService;
  /** Asset event tracking */
  events: AssetEventsService;
  /** Asset audit trail */
  audits: AssetAuditsService;
  /** Asset category management */
  categories: CategoriesService;
  /** Asset tag management */
  tags: TagsService;
  /** Vendor management */
  vendors: VendorsService;
  /** Warehouse management */
  warehouses: WarehousesService;
  /** Asset-entity relationship management */
  entities: AssetsEntitiesService;
  /** Asset operations (check-in, check-out, transfer) */
  operations: AssetOperationsService;
  /** Asset alert management */
  alerts: AlertsService;
  /** Asset user assignments */
  users: AssetsUsersService;
  /** Asset image management */
  images: AssetImagesService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Assets block.
 *
 * @example
 * ```typescript
 * const block = createAssetsBlock(transport, { appId: 'xxx' });
 * const assets = await block.assets.list({ page: 1 });
 * ```
 */
export function createAssetsBlock(
  transport: Transport,
  config: AssetsBlockConfig
): AssetsBlock {
  return {
    assets: createAssetsService(transport, config),
    events: createAssetEventsService(transport, config),
    audits: createAssetAuditsService(transport, config),
    categories: createCategoriesService(transport, config),
    tags: createTagsService(transport, config),
    vendors: createVendorsService(transport, config),
    warehouses: createWarehousesService(transport, config),
    entities: createAssetsEntitiesService(transport, config),
    operations: createAssetOperationsService(transport, config),
    alerts: createAlertsService(transport, config),
    users: createAssetsUsersService(transport, config),
    images: createAssetImagesService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
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
    'Category',
    'Tag',
    'Vendor',
    'Warehouse',
    'Entity',
    'AssetOperation',
    'Alert',
  ],
};
