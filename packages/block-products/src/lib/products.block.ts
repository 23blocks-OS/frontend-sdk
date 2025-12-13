import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createProductsService,
  createCartService,
  createCategoriesService,
  createBrandsService,
  createVendorsService,
  createWarehousesService,
  createChannelsService,
  createCollectionsService,
  type ProductsService,
  type CartService,
  type CategoriesService,
  type BrandsService,
  type VendorsService,
  type WarehousesService,
  type ChannelsService,
  type CollectionsService,
} from './services';

export interface ProductsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface ProductsBlock {
  products: ProductsService;
  cart: CartService;
  categories: CategoriesService;
  brands: BrandsService;
  vendors: VendorsService;
  warehouses: WarehousesService;
  channels: ChannelsService;
  collections: CollectionsService;
}

export function createProductsBlock(
  transport: Transport,
  config: ProductsBlockConfig
): ProductsBlock {
  return {
    products: createProductsService(transport, config),
    cart: createCartService(transport, config),
    categories: createCategoriesService(transport, config),
    brands: createBrandsService(transport, config),
    vendors: createVendorsService(transport, config),
    warehouses: createWarehousesService(transport, config),
    channels: createChannelsService(transport, config),
    collections: createCollectionsService(transport, config),
  };
}

export const productsBlockMetadata: BlockMetadata = {
  name: 'products',
  version: '0.1.0',
  description: 'E-commerce products, catalog, cart, and inventory management',
  resourceTypes: [
    'Product',
    'Variation',
    'ProductImage',
    'ProductStock',
    'ProductReview',
    'Cart',
    'CartDetail',
    'Category',
    'Brand',
    'Vendor',
    'Warehouse',
    'Channel',
    'Collection',
    'ProductCatalog',
  ],
};
