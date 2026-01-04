import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createProductsService,
  createCartService,
  createCartDetailsService,
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
  createProductImagesService,
  createProductVariationsService,
  createProductReviewsService,
  createStockService,
  createProductSuggestionsService,
  createAddonsService,
  createMyCartsService,
  createRemarketingService,
  createVisitorsService,
  type ProductsService,
  type CartService,
  type CartDetailsService,
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
  type ProductImagesService,
  type ProductVariationsService,
  type ProductReviewsService,
  type StockService,
  type ProductSuggestionsService,
  type AddonsService,
  type MyCartsService,
  type RemarketingService,
  type VisitorsService,
} from './services';

export interface ProductsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface ProductsBlock {
  products: ProductsService;
  cart: CartService;
  cartDetails: CartDetailsService;
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
  images: ProductImagesService;
  variations: ProductVariationsService;
  reviews: ProductReviewsService;
  stock: StockService;
  suggestions: ProductSuggestionsService;
  addons: AddonsService;
  myCarts: MyCartsService;
  remarketing: RemarketingService;
  visitors: VisitorsService;
}

export function createProductsBlock(
  transport: Transport,
  config: ProductsBlockConfig
): ProductsBlock {
  return {
    products: createProductsService(transport, config),
    cart: createCartService(transport, config),
    cartDetails: createCartDetailsService(transport, config),
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
    images: createProductImagesService(transport, config),
    variations: createProductVariationsService(transport, config),
    reviews: createProductReviewsService(transport, config),
    stock: createStockService(transport, config),
    suggestions: createProductSuggestionsService(transport, config),
    addons: createAddonsService(transport, config),
    myCarts: createMyCartsService(transport, config),
    remarketing: createRemarketingService(transport, config),
    visitors: createVisitorsService(transport, config),
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
