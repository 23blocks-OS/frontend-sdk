export interface VendorPayment {
  id: string;
  uniqueId: string;
  vendorUniqueId?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorContact?: string;
  paymentType?: string;
  price?: number;
  discount?: number;
  discountValue?: number;
  fees?: number;
  feesValue?: number;
  tips?: number;
  tipsValue?: number;
  subtotal?: number;
  delivery?: number;
  tax?: number;
  taxValue?: number;
  status?: string;
  paidAt?: Date;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches vendor_payment_params in vendor_payments_controller.rb */
export interface CreateVendorPaymentRequest {
  vendorUniqueId?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorContact?: string;
  paymentType?: string;
  price?: number;
  discount?: number;
  discountValue?: number;
  fees?: number;
  feesValue?: number;
  tips?: number;
  tipsValue?: number;
  subtotal?: number;
  delivery?: number;
  tax?: number;
  taxValue?: number;
  payload?: Record<string, unknown>;
}

export type UpdateVendorPaymentRequest = CreateVendorPaymentRequest;

/** Matches payment_params (pay) in vendor_payments_controller.rb */
export interface PayVendorPaymentRequest {
  paymentType?: string;
  gatewayUniqueId?: string;
  gatewayName?: string;
  gatewayReference?: string;
  gatewayOrderId?: string;
  gatewayFranchise?: string;
  gatewayPaymentType?: string;
  gatewayTransactionId?: string;
  gatewayDescription?: string;
  gatewayFees?: number;
  gatewayFeesValue?: number;
  gatewayTips?: number;
  gatewayTipsValue?: number;
  gatewaySubtotal?: number;
  gatewayDiscount?: number;
  gatewayDiscountValue?: number;
  gatewayDelivery?: number;
  gatewayTax?: number;
  gatewayTaxValue?: number;
  gatewayTotal?: number;
  gatewayBalance?: number;
  gatewayPaidAt?: string;
  gatewayStatus?: string;
  gatewayResponse?: string;
  gatewayPayload?: Record<string, unknown>;
  paidAt?: string;
}

export interface OrderDetailVendor {
  id: string;
  uniqueId: string;
  orderDetailUniqueId?: string;
  vendorUniqueId?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorContact?: string;
  status?: string;
  referredBy?: string;
  promoCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches vendor_params in order_details_vendors_controller.rb */
export interface CreateOrderDetailVendorRequest {
  vendorUniqueId?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorContact?: string;
  status?: string;
  referredBy?: string;
  promoCode?: string;
}

export type UpdateOrderDetailVendorRequest = CreateOrderDetailVendorRequest;
