export interface VendorPayment {
  id: string;
  uniqueId: string;
  orderUniqueId: string;
  detailUniqueId: string;
  vendorUniqueId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: Date;
  reference?: string;
  notes?: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVendorPaymentRequest {
  amount: number;
  currency?: string;
  reference?: string;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateVendorPaymentRequest {
  amount?: number;
  reference?: string;
  notes?: string;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface OrderDetailVendor {
  id: string;
  uniqueId: string;
  orderDetailUniqueId?: string;
  sourceId?: string;
  vendorUniqueId: string;
  vendorName?: string;
  amount: number;
  commission?: number;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDetailVendorRequest {
  vendorUniqueId: string;
  amount: number;
  commission?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateOrderDetailVendorRequest {
  amount?: number;
  commission?: number;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface CreateOrderDetailVendorBySourceRequest {
  vendorUniqueId: string;
  orderUniqueId: string;
  orderDetailUniqueId: string;
  amount: number;
  commission?: number;
  payload?: Record<string, unknown>;
}
