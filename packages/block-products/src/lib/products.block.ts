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
  createProductSetsService,
  createShoppingListsService,
  createProductPromotionsService,
  createProductPricesService,
  createProductFiltersService,
  type ProductsService,
  type CartService,
  type CategoriesService,
  type BrandsService,
  type VendorsService,
  type WarehousesService,
  type ChannelsService,
  type CollectionsService,
  type ProductSetsService,
  type ShoppingListsService,
  type ProductPromotionsService,
  type ProductPricesService,
  type ProductFiltersService,
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
  productSets: ProductSetsService;
  shoppingLists: ShoppingListsService;
  promotions: ProductPromotionsService;
  prices: ProductPricesService;
  filters: ProductFiltersService;
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
    productSets: createProductSetsService(transport, config),
    shoppingLists: createShoppingListsService(transport, config),
    promotions: createProductPromotionsService(transport, config),
    prices: createProductPricesService(transport, config),
    filters: createProductFiltersService(transport, config),
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
    'ProductSet',
    'ShoppingList',
    'ProductPromotion',
    'ProductPrice',
    'ProductFilter',
  ],
};
