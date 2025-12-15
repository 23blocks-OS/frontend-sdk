import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { ProductStock } from '../types/product';
import { productStockMapper } from '../mappers/product.mapper';

export interface CreateStockRequest {
  vendorUniqueId: string;
  warehouseUniqueId: string;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  reorderPoint?: number;
}

export interface UpdateStockRequest {
  quantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  reorderPoint?: number;
}

export interface SearchStockParams {
  vendorUniqueId?: string;
  warehouseUniqueId?: string;
  lowStock?: boolean;
  page?: number;
  perPage?: number;
}

export interface StockService {
  get(productUniqueId: string): Promise<ProductStock[]>;
  create(productUniqueId: string, data: CreateStockRequest): Promise<ProductStock>;
  update(productUniqueId: string, stockUniqueId: string, data: UpdateStockRequest): Promise<ProductStock>;
  updateWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, quantity: number): Promise<ProductStock>;
  updateVariationWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, variationUniqueId: string, quantity: number): Promise<ProductStock>;
  search(params: SearchStockParams): Promise<PageResult<ProductStock>>;
  evaluateRules(stockUniqueId: string): Promise<{ alerts: any[] }>;
}

export function createStockService(transport: Transport, _config: { appId: string }): StockService {
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
          quantity: data.quantity,
          min_quantity: data.minQuantity,
          max_quantity: data.maxQuantity,
          reorder_point: data.reorderPoint,
        },
      });
      return decodeOne(response, productStockMapper);
    },

    async update(productUniqueId: string, stockUniqueId: string, data: UpdateStockRequest): Promise<ProductStock> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/stock/${stockUniqueId}`, {
        stock: {
          quantity: data.quantity,
          min_quantity: data.minQuantity,
          max_quantity: data.maxQuantity,
          reorder_point: data.reorderPoint,
        },
      });
      return decodeOne(response, productStockMapper);
    },

    async updateWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, quantity: number): Promise<ProductStock> {
      const response = await transport.put<unknown>(`/vendors/${vendorUniqueId}/warehouses/${warehouseUniqueId}/products/${productUniqueId}`, {
        stock: { quantity },
      });
      return decodeOne(response, productStockMapper);
    },

    async updateVariationWithDetails(vendorUniqueId: string, warehouseUniqueId: string, productUniqueId: string, variationUniqueId: string, quantity: number): Promise<ProductStock> {
      const response = await transport.put<unknown>(`/vendors/${vendorUniqueId}/warehouses/${warehouseUniqueId}/products/${productUniqueId}/variations/${variationUniqueId}`, {
        stock: { quantity },
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
