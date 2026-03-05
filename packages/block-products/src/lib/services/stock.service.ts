import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { ProductStock } from '../types/product.js';
import { productStockMapper } from '../mappers/product.mapper.js';

export interface CreateStockRequest {
  vendorUniqueId: string;
  warehouseUniqueId: string;
  available: number;
  reserved?: number;
  enforceAvailability?: boolean;
  stockUnit?: string;
  priority?: number;
  onTransaction?: number;
  onTransit?: number;
  prime?: boolean;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface UpdateStockRequest {
  available?: number;
  reserved?: number;
  enforceAvailability?: boolean;
  stockUnit?: string;
  priority?: number;
  onTransaction?: number;
  onTransit?: number;
  prime?: boolean;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface SearchStockParams {
  vendorUniqueId?: string;
  warehouseUniqueId?: string;
  lowStock?: boolean;
  page?: number;
  perPage?: number;
}

export interface StockService {
  /**
   * Get all stock entries for a product across vendors and warehouses.
   * @param productUniqueId - The product unique ID
   * @returns Array of ProductStock entries
   */
  get(productUniqueId: string): Promise<ProductStock[]>;

  /**
   * Create a new stock entry for a product at a specific vendor and warehouse.
   * @param productUniqueId - The product unique ID
   * @param data - Stock creation payload including vendor, warehouse, quantity, and optional thresholds
   * @returns The newly created ProductStock entry
   */
  create(productUniqueId: string, data: CreateStockRequest): Promise<ProductStock>;

  /**
   * Update an existing stock entry by its unique identifier.
   * @param productUniqueId - The product unique ID
   * @param stockUniqueId - The stock entry unique ID
   * @param data - Fields to update (quantity, min/max thresholds, reorder point)
   * @returns The updated ProductStock entry
   */
  update(productUniqueId: string, stockUniqueId: string, data: UpdateStockRequest): Promise<ProductStock>;

  /**
   * Update stock quantity using vendor, warehouse, and product identifiers.
   * @param vendorUniqueId - The vendor unique ID
   * @param warehouseUniqueId - The warehouse unique ID
   * @param productUniqueId - The product unique ID
   * @param quantity - The new stock quantity
   * @returns The updated ProductStock entry
   * @note Routes through the vendor/warehouse/product nested endpoint
   */
  updateWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, quantity: number): Promise<ProductStock>;

  /**
   * Update stock quantity for a specific variation using vendor, warehouse, product, and variation identifiers.
   * @param vendorUniqueId - The vendor unique ID
   * @param warehouseUniqueId - The warehouse unique ID
   * @param productUniqueId - The product unique ID
   * @param variationUniqueId - The variation unique ID
   * @param quantity - The new stock quantity
   * @returns The updated ProductStock entry
   * @note Routes through the vendor/warehouse/product/variation nested endpoint
   */
  updateVariationWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, variationUniqueId: string, quantity: number): Promise<ProductStock>;

  /**
   * Search stock entries with filters for vendor, warehouse, and low-stock status.
   * @param params - Search criteria including vendor, warehouse, low-stock flag, and pagination
   * @returns Paginated result containing ProductStock items and page metadata
   */
  search(params: SearchStockParams): Promise<PageResult<ProductStock>>;

  /**
   * Evaluate stock rules and return any triggered alerts for a stock entry.
   * @param stockUniqueId - The stock entry unique ID
   * @returns Object containing an alerts array with triggered rule evaluations
   */
  evaluateRules(stockUniqueId: string): Promise<{ alerts: any[] }>;
}

export function createStockService(transport: Transport, _config: { apiKey: string }): StockService {
  return {
    async get(productUniqueId: string): Promise<ProductStock[]> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/stock`);
      return decodeMany(response, productStockMapper);
    },

    async create(productUniqueId: string, data: CreateStockRequest): Promise<ProductStock> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/stock`, {
        stock: {
          vendor_unique_id: data.vendorUniqueId,
          warehouse_unique_id: data.warehouseUniqueId,
          available: data.available,
          reserved: data.reserved,
          enforce_availability: data.enforceAvailability,
          stock_unit: data.stockUnit,
          priority: data.priority,
          on_transaction: data.onTransaction,
          on_transit: data.onTransit,
          prime: data.prime,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, productStockMapper);
    },

    async update(productUniqueId: string, stockUniqueId: string, data: UpdateStockRequest): Promise<ProductStock> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/stock/${stockUniqueId}`, {
        stock: {
          available: data.available,
          reserved: data.reserved,
          enforce_availability: data.enforceAvailability,
          stock_unit: data.stockUnit,
          priority: data.priority,
          on_transaction: data.onTransaction,
          on_transit: data.onTransit,
          prime: data.prime,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, productStockMapper);
    },

    async updateWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, quantity: number): Promise<ProductStock> {
      const response = await transport.put<unknown>(`/vendors/${vendorUniqueId}/warehouses/${warehouseUniqueId}/products/${productUniqueId}`, {
        stock: { available: quantity },
      });
      return decodeOne(response, productStockMapper);
    },

    async updateVariationWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, variationUniqueId: string, quantity: number): Promise<ProductStock> {
      const response = await transport.put<unknown>(`/vendors/${vendorUniqueId}/warehouses/${warehouseUniqueId}/products/${productUniqueId}/variations/${variationUniqueId}`, {
        stock: { available: quantity },
      });
      return decodeOne(response, productStockMapper);
    },

    async search(params: SearchStockParams): Promise<PageResult<ProductStock>> {
      const response = await transport.post<unknown>('/stocks/search', {
        vendor_unique_id: params.vendorUniqueId,
        warehouse_unique_id: params.warehouseUniqueId,
        low_stock: params.lowStock,
        page: params.page,
        per_page: params.perPage,
      });
      return decodePageResult(response, productStockMapper);
    },

    async evaluateRules(stockUniqueId: string): Promise<{ alerts: any[] }> {
      const response = await transport.post<any>(`/stocks/${stockUniqueId}/eval`, {});
      return { alerts: response.alerts || [] };
    },
  };
}
