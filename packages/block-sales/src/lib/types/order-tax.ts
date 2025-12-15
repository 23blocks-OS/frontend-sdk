export interface OrderTax {
  id: string;
  uniqueId: string;
  orderUniqueId: string;
  name: string;
  rate: number;
  amount: number;
  type: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderTaxRequest {
  name: string;
  rate?: number;
  amount?: number;
  type: string;
  payload?: Record<string, unknown>;
}

export interface UpdateOrderTaxRequest {
  name?: string;
  rate?: number;
  amount?: number;
  type?: string;
  payload?: Record<string, unknown>;
}
