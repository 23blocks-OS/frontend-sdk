import type { IdentityCore } from '@23blocks/contracts';

export interface Payment extends IdentityCore {
  orderUniqueId?: string;
  paymentType?: string;
  gatewayUniqueId?: string;
  gatewayName?: string;
  gatewayReference?: string;
  gatewayOrderId?: string;
  gatewayFranchise?: string;
  gatewayPaymentType?: string;
  gatewayTransactionId?: string;
  gatewayDescription?: string;
  gatewaySubtotal?: number;
  gatewayDiscount?: number;
  gatewayDiscountValue?: number;
  gatewayDelivery?: number;
  gatewayTax?: number;
  gatewayTaxValue?: number;
  gatewayFees?: number;
  gatewayFeesValue?: number;
  gatewayTips?: number;
  gatewayTipsValue?: number;
  gatewayTotal?: number;
  gatewayBalance?: number;
  gatewayPaidAt?: Date;
  gatewayStatus?: string;
  gatewayResponse?: string;
  status?: string;
  paidAt?: Date;
}

/** Matches payment_params in orders_controller.rb — POST /orders/:unique_id/payments */
export interface CreatePaymentRequest {
  gatewayUniqueId?: string;
  gatewayName?: string;
  gatewayReference?: string;
  gatewayOrderId?: string;
  gatewayFranchise?: string;
  gatewayPaymentType?: string;
  gatewayTransactionId?: string;
  gatewayDescription?: string;
  gatewaySubtotal?: number;
  gatewayDiscount?: number;
  gatewayDiscountValue?: number;
  gatewayDelivery?: number;
  gatewayTax?: number;
  gatewayTaxValue?: number;
  gatewayFees?: number;
  gatewayFeesValue?: number;
  gatewayTips?: number;
  gatewayTipsValue?: number;
  gatewayTotal?: number;
  gatewayBalance?: number;
  gatewayPaidAt?: string;
  gatewayStatus?: string;
  gatewayResponse?: string;
  paymentType?: string;
}

/** Matches payment_method_params — POST /orders/:unique_id/payments/method */
export interface CreatePaymentMethodRequest {
  paymentType?: string;
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
  state?: string;
  brand?: string;
  cardCountry?: string;
  expMonth?: string;
  expYear?: string;
  fingerprint?: string;
  last4?: string;
  paymentProcessorName?: string;
  paymentProcessorId?: string;
  customerUniqueId?: string;
  customerName?: string;
  customerEmail?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface ListPaymentsParams {
  page?: number;
  perPage?: number;
  status?: string;
  orderUniqueId?: string;
  paymentType?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
