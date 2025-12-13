import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createProductsBlock,
  type ProductsBlock,
  type ProductsBlockConfig,
  type Product,
  type ProductVariation,
  type ProductImage,
  type ProductStock,
  type ProductReview,
  type CreateProductRequest,
  type UpdateProductRequest,
  type ListProductsParams,
  type CreateVariationRequest,
  type UpdateVariationRequest,
  type Cart,
  type CartDetail,
  type AddToCartRequest,
  type UpdateCartItemRequest,
  type UpdateCartRequest,
  type CheckoutRequest,
  type Category,
  type Brand,
  type Vendor,
  type Warehouse,
  type Channel,
  type Collection,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
  type CreateBrandRequest,
  type UpdateBrandRequest,
  type CreateVendorRequest,
  type UpdateVendorRequest,
  type CreateWarehouseRequest,
  type UpdateWarehouseRequest,
  type ListCategoriesParams,
  type ListVendorsParams,
  type ListWarehousesParams,
} from '@23blocks/block-products';
import { TRANSPORT, PRODUCTS_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Products block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class ProductsComponent {
 *   constructor(private products: ProductsService) {}
 *
 *   loadProducts() {
 *     this.products.listProducts().subscribe({
 *       next: (result) => console.log('Products:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly block: ProductsBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(PRODUCTS_CONFIG) config: ProductsBlockConfig
  ) {
    this.block = createProductsBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Products Service
  // ─────────────────────────────────────────────────────────────────────────────

  listProducts(params?: ListProductsParams): Observable<PageResult<Product>> {
    return from(this.block.products.list(params));
  }

  getProduct(uniqueId: string): Observable<Product> {
    return from(this.block.products.get(uniqueId));
  }

  createProduct(data: CreateProductRequest): Observable<Product> {
    return from(this.block.products.create(data));
  }

  updateProduct(uniqueId: string, data: UpdateProductRequest): Observable<Product> {
    return from(this.block.products.update(uniqueId, data));
  }

  deleteProduct(uniqueId: string): Observable<void> {
    return from(this.block.products.delete(uniqueId));
  }

  recoverProduct(uniqueId: string): Observable<Product> {
    return from(this.block.products.recover(uniqueId));
  }

  searchProducts(query: string, params?: ListProductsParams): Observable<PageResult<Product>> {
    return from(this.block.products.search(query, params));
  }

  listDeletedProducts(params?: ListProductsParams): Observable<PageResult<Product>> {
    return from(this.block.products.listDeleted(params));
  }

  // Variations
  listVariations(productUniqueId: string): Observable<ProductVariation[]> {
    return from(this.block.products.listVariations(productUniqueId));
  }

  getVariation(uniqueId: string): Observable<ProductVariation> {
    return from(this.block.products.getVariation(uniqueId));
  }

  createVariation(data: CreateVariationRequest): Observable<ProductVariation> {
    return from(this.block.products.createVariation(data));
  }

  updateVariation(uniqueId: string, data: UpdateVariationRequest): Observable<ProductVariation> {
    return from(this.block.products.updateVariation(uniqueId, data));
  }

  deleteVariation(uniqueId: string): Observable<void> {
    return from(this.block.products.deleteVariation(uniqueId));
  }

  // Images
  listImages(productUniqueId: string): Observable<ProductImage[]> {
    return from(this.block.products.listImages(productUniqueId));
  }

  addImage(productUniqueId: string, imageUrl: string, isPrimary?: boolean): Observable<ProductImage> {
    return from(this.block.products.addImage(productUniqueId, imageUrl, isPrimary));
  }

  deleteImage(uniqueId: string): Observable<void> {
    return from(this.block.products.deleteImage(uniqueId));
  }

  // Stock
  getStock(productUniqueId: string, vendorUniqueId?: string): Observable<ProductStock[]> {
    return from(this.block.products.getStock(productUniqueId, vendorUniqueId));
  }

  updateStock(
    productUniqueId: string,
    vendorUniqueId: string,
    warehouseUniqueId: string,
    quantity: number
  ): Observable<ProductStock> {
    return from(this.block.products.updateStock(productUniqueId, vendorUniqueId, warehouseUniqueId, quantity));
  }

  // Reviews
  listReviews(productUniqueId: string): Observable<PageResult<ProductReview>> {
    return from(this.block.products.listReviews(productUniqueId));
  }

  addReview(
    productUniqueId: string,
    rating: number,
    title?: string,
    content?: string
  ): Observable<ProductReview> {
    return from(this.block.products.addReview(productUniqueId, rating, title, content));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Cart Service
  // ─────────────────────────────────────────────────────────────────────────────

  getCart(userUniqueId: string): Observable<Cart> {
    return from(this.block.cart.get(userUniqueId));
  }

  getOrCreateCart(userUniqueId: string): Observable<Cart> {
    return from(this.block.cart.getOrCreate(userUniqueId));
  }

  updateCart(userUniqueId: string, data: UpdateCartRequest): Observable<Cart> {
    return from(this.block.cart.update(userUniqueId, data));
  }

  deleteCart(userUniqueId: string): Observable<void> {
    return from(this.block.cart.delete(userUniqueId));
  }

  // Cart Items
  addCartItem(userUniqueId: string, item: AddToCartRequest): Observable<Cart> {
    return from(this.block.cart.addItem(userUniqueId, item));
  }

  updateCartItem(userUniqueId: string, productUniqueId: string, data: UpdateCartItemRequest): Observable<Cart> {
    return from(this.block.cart.updateItem(userUniqueId, productUniqueId, data));
  }

  removeCartItem(userUniqueId: string, productUniqueId: string): Observable<Cart> {
    return from(this.block.cart.removeItem(userUniqueId, productUniqueId));
  }

  getCartItems(userUniqueId: string): Observable<CartDetail[]> {
    return from(this.block.cart.getItems(userUniqueId));
  }

  // Checkout
  checkout(userUniqueId: string, data?: CheckoutRequest): Observable<Cart> {
    return from(this.block.cart.checkout(userUniqueId, data));
  }

  orderCart(userUniqueId: string): Observable<{ cart: Cart; orderUniqueId: string }> {
    return from(this.block.cart.order(userUniqueId));
  }

  orderCartItem(userUniqueId: string, productUniqueId: string): Observable<{ cart: Cart; orderUniqueId: string }> {
    return from(this.block.cart.orderItem(userUniqueId, productUniqueId));
  }

  cancelCart(userUniqueId: string): Observable<Cart> {
    return from(this.block.cart.cancel(userUniqueId));
  }

  cancelCartItem(userUniqueId: string, productUniqueId: string): Observable<Cart> {
    return from(this.block.cart.cancelItem(userUniqueId, productUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Categories Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCategories(params?: ListCategoriesParams): Observable<PageResult<Category>> {
    return from(this.block.categories.list(params));
  }

  getCategory(uniqueId: string): Observable<Category> {
    return from(this.block.categories.get(uniqueId));
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return from(this.block.categories.create(data));
  }

  updateCategory(uniqueId: string, data: UpdateCategoryRequest): Observable<Category> {
    return from(this.block.categories.update(uniqueId, data));
  }

  deleteCategory(uniqueId: string): Observable<void> {
    return from(this.block.categories.delete(uniqueId));
  }

  recoverCategory(uniqueId: string): Observable<Category> {
    return from(this.block.categories.recover(uniqueId));
  }

  getCategoryChildren(uniqueId: string): Observable<Category[]> {
    return from(this.block.categories.getChildren(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Brands Service
  // ─────────────────────────────────────────────────────────────────────────────

  listBrands(page?: number, perPage?: number): Observable<PageResult<Brand>> {
    return from(this.block.brands.list(page, perPage));
  }

  getBrand(uniqueId: string): Observable<Brand> {
    return from(this.block.brands.get(uniqueId));
  }

  createBrand(data: CreateBrandRequest): Observable<Brand> {
    return from(this.block.brands.create(data));
  }

  updateBrand(uniqueId: string, data: UpdateBrandRequest): Observable<Brand> {
    return from(this.block.brands.update(uniqueId, data));
  }

  deleteBrand(uniqueId: string): Observable<void> {
    return from(this.block.brands.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Vendors Service
  // ─────────────────────────────────────────────────────────────────────────────

  listVendors(params?: ListVendorsParams): Observable<PageResult<Vendor>> {
    return from(this.block.vendors.list(params));
  }

  getVendor(uniqueId: string): Observable<Vendor> {
    return from(this.block.vendors.get(uniqueId));
  }

  createVendor(data: CreateVendorRequest): Observable<Vendor> {
    return from(this.block.vendors.create(data));
  }

  updateVendor(uniqueId: string, data: UpdateVendorRequest): Observable<Vendor> {
    return from(this.block.vendors.update(uniqueId, data));
  }

  deleteVendor(uniqueId: string): Observable<void> {
    return from(this.block.vendors.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Warehouses Service
  // ─────────────────────────────────────────────────────────────────────────────

  listWarehouses(params?: ListWarehousesParams): Observable<PageResult<Warehouse>> {
    return from(this.block.warehouses.list(params));
  }

  getWarehouse(uniqueId: string): Observable<Warehouse> {
    return from(this.block.warehouses.get(uniqueId));
  }

  createWarehouse(data: CreateWarehouseRequest): Observable<Warehouse> {
    return from(this.block.warehouses.create(data));
  }

  updateWarehouse(uniqueId: string, data: UpdateWarehouseRequest): Observable<Warehouse> {
    return from(this.block.warehouses.update(uniqueId, data));
  }

  deleteWarehouse(uniqueId: string): Observable<void> {
    return from(this.block.warehouses.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Channels Service
  // ─────────────────────────────────────────────────────────────────────────────

  listChannels(): Observable<Channel[]> {
    return from(this.block.channels.list());
  }

  getChannel(uniqueId: string): Observable<Channel> {
    return from(this.block.channels.get(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Collections Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCollections(): Observable<Collection[]> {
    return from(this.block.collections.list());
  }

  getCollection(uniqueId: string): Observable<Collection> {
    return from(this.block.collections.get(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): ProductsBlock {
    return this.block;
  }
}
