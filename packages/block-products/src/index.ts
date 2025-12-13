// Block factory and metadata
export { createProductsBlock, productsBlockMetadata } from './lib/products.block';
export type { ProductsBlock, ProductsBlockConfig } from './lib/products.block';

// Types
export type {
  // Product types
  Product,
  ProductVariation,
  ProductImage,
  ProductStock,
  ProductReview,
  CreateProductRequest,
  UpdateProductRequest,
  ListProductsParams,
  CreateVariationRequest,
  UpdateVariationRequest,
  // Cart types
  Cart,
  CartDetail,
  AddToCartRequest,
  UpdateCartItemRequest,
  UpdateCartRequest,
  CheckoutRequest,
  CartResponse,
  OrderCartResponse,
  // Catalog types
  Category,
  Brand,
  Vendor,
  Warehouse,
  Channel,
  Collection,
  ProductCatalog,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateBrandRequest,
  UpdateBrandRequest,
  CreateVendorRequest,
  UpdateVendorRequest,
  CreateWarehouseRequest,
  UpdateWarehouseRequest,
  ListCategoriesParams,
  ListVendorsParams,
  ListWarehousesParams,
} from './lib/types';

// Services
export type {
  ProductsService,
  CartService,
  CategoriesService,
  BrandsService,
  VendorsService,
  WarehousesService,
  ChannelsService,
  CollectionsService,
} from './lib/services';

export {
  createProductsService,
  createCartService,
  createCategoriesService,
  createBrandsService,
  createVendorsService,
  createWarehousesService,
  createChannelsService,
  createCollectionsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  productMapper,
  productVariationMapper,
  productImageMapper,
  productStockMapper,
  productReviewMapper,
  cartMapper,
  cartDetailMapper,
  categoryMapper,
  brandMapper,
  vendorMapper,
  warehouseMapper,
  channelMapper,
  collectionMapper,
} from './lib/mappers';
