import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
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
} from './services';

export interface AssetsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface AssetsBlock {
  assets: AssetsService;
  events: AssetEventsService;
  audits: AssetAuditsService;
  categories: CategoriesService;
  tags: TagsService;
  vendors: VendorsService;
  warehouses: WarehousesService;
  entities: AssetsEntitiesService;
  operations: AssetOperationsService;
  alerts: AlertsService;
  users: AssetsUsersService;
  images: AssetImagesService;
}

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
