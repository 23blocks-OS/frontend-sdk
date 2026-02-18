export interface OrderTax {
  id: string;
  uniqueId: string;
  orderUniqueId: string;
  taxUniqueId?: string;
  name?: string;
  description?: string;
  level?: string;
  taxValue?: number;
  tax?: number;
  displayOrder?: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches tax_params in order_taxes_controller.rb */
export interface CreateOrderTaxRequest {
  taxUniqueId?: string;
  name?: string;
  description?: string;
  level?: string;
  taxValue?: number;
  tax?: number;
  displayOrder?: number;
  status?: string;
}

export type UpdateOrderTaxRequest = CreateOrderTaxRequest;
