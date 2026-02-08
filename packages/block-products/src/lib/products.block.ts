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
  createProductVariationReviewsService,
  createStockService,
  createProductSuggestionsService,
  createAddonsService,
  createMyCartsService,
  createRemarketingService,
  createVisitorsService,
  createProductVendorsService,
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
  type ProductVariationReviewsService,
  type StockService,
  type ProductSuggestionsService,
  type AddonsService,
  type MyCartsService,
  type RemarketingService,
  type VisitorsService,
  type ProductVendorsService,
} from './services/index.js';

/**
 * Configuration for the Products block.
 */
export interface ProductsBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * E-commerce product catalog and cart management block interface.
 */
export interface ProductsBlock {
  /** Product CRUD operations */
  products: ProductsService;
  /** Shopping cart management */
  cart: CartService;
  /** Cart line-item detail management */
  cartDetails: CartDetailsService;
  /** Product category management */
  categories: CategoriesService;
  /** Brand management */
  brands: BrandsService;
  /** Vendor management */
  vendors: VendorsService;
  /** Warehouse management */
  warehouses: WarehousesService;
  /** Sales channel management */
  channels: ChannelsService;
  /** Product collection management */
  collections: CollectionsService;
  /** Product set management */
  productSets: ProductSetsService;
  /** Shopping list management */
  shoppingLists: ShoppingListsService;
  /** Product promotion management */
  promotions: ProductPromotionsService;
  /** Product pricing management */
  prices: ProductPricesService;
  /** Product filter management */
  filters: ProductFiltersService;
  /** Product image management */
  images: ProductImagesService;
  /** Product variation management */
  variations: ProductVariationsService;
  /** Product review management */
  reviews: ProductReviewsService;
  /** Product variation review management */
  variationReviews: ProductVariationReviewsService;
  /** Stock/inventory management */
  stock: StockService;
  /** Product suggestion management */
  suggestions: ProductSuggestionsService;
  /** Product add-on management */
  addons: AddonsService;
  /** Current user cart management */
  myCarts: MyCartsService;
  /** Remarketing campaign management */
  remarketing: RemarketingService;
  /** Visitor tracking */
  visitors: VisitorsService;
  /** Product-vendor association management */
  productVendors: ProductVendorsService;
}

/**
 * Create the Products block.
 *
 * @example
 * ```typescript
 * const block = createProductsBlock(transport, { appId: 'xxx' });
 * const products = await block.products.list({ page: 1 });
 * ```
 */
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
    variationReviews: createProductVariationReviewsService(transport, config),
    stock: createStockService(transport, config),
    suggestions: createProductSuggestionsService(transport, config),
    addons: createAddonsService(transport, config),
    myCarts: createMyCartsService(transport, config),
    remarketing: createRemarketingService(transport, config),
    visitors: createVisitorsService(transport, config),
    productVendors: createProductVendorsService(transport, config),
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
    'ProductVariationReview',
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
    'ProductVendor',
  ],
};
