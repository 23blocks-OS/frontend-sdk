export interface OrderReportSummary {
  totalOrders: number;
  totalRevenue: number;
  totalTax: number;
  totalTips: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  currency: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface OrderReportList {
  orders: OrderReportItem[];
  summary: OrderReportSummary;
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface OrderReportItem {
  uniqueId: string;
  orderNumber?: string;
  customerName?: string;
  subtotal: number;
  tax: number;
  tips: number;
  total: number;
  status: string;
  createdAt: Date;
}

/** Valid group_by column names for `POST /reports/orders/summary`. */
export type OrderGroupBy =
  | 'status' | 'logistics_status' | 'source'
  | 'customer_unique_id' | 'promo_code' | 'referred_by'
  | 'parent_unique_id' | 'display';

export interface OrderReportParams {
  startDate: string;
  endDate: string;
  status?: string;
  customerUniqueId?: string;
  userUniqueId?: string;
  /** Column to group summary results by. Must be a valid column name. */
  groupBy?: OrderGroupBy;
  page?: number;
  perPage?: number;
}

export interface VendorPaymentReportSummary {
  totalPayments: number;
  totalAmount: number;
  totalPending: number;
  totalPaid: number;
  paymentsByStatus: Record<string, number>;
  currency: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface VendorPaymentReportList {
  payments: VendorPaymentReportItem[];
  summary: VendorPaymentReportSummary;
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface VendorPaymentReportItem {
  uniqueId: string;
  orderUniqueId: string;
  vendorName?: string;
  amount: number;
  status: string;
  paidAt?: Date;
  createdAt: Date;
}

/** Valid group_by column names for `POST /reports/vendors/payments/summary`. */
export type VendorPaymentGroupBy =
  | 'status' | 'vendor_unique_id' | 'payment_type' | 'gateway_unique_id';

export interface VendorPaymentReportParams {
  startDate: string;
  endDate: string;
  vendorUniqueId?: string;
  status?: string;
  /** Column to group summary results by. Must be a valid column name. */
  groupBy?: VendorPaymentGroupBy;
  page?: number;
  perPage?: number;
}

export interface SubscriptionReportSummary {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  trialSubscriptions: number;
  totalMRR: number;
  currency: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface SubscriptionReportList {
  subscriptions: SubscriptionReportItem[];
  summary: SubscriptionReportSummary;
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface SubscriptionReportItem {
  uniqueId: string;
  userUniqueId: string;
  userName?: string;
  modelName?: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

/** Valid group_by column names for `POST /reports/users/subscriptions/summary`. */
export type SubscriptionGroupBy =
  | 'status' | 'subscription_model_unique_id' | 'subscription_type' | 'enabled';

export interface SubscriptionReportParams {
  startDate: string;
  endDate: string;
  status?: string;
  subscriptionModelUniqueId?: string;
  /** Column to group summary results by. Must be a valid column name. */
  groupBy?: SubscriptionGroupBy;
  page?: number;
  perPage?: number;
}

export interface ProviderReportSummary {
  totalProviders: number;
  totalAmount: number;
  totalCommission: number;
  providersByStatus: Record<string, number>;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface ProviderReportList {
  providers: ProviderReportItem[];
  summary: ProviderReportSummary;
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface ProviderReportItem {
  uniqueId: string;
  vendorName?: string;
  amount: number;
  commission?: number;
  status: string;
  createdAt: Date;
}

/** Valid group_by column names for `POST /reports/orders/providers/summary`. */
export type ProviderGroupBy =
  | 'status' | 'vendor_unique_id' | 'vendor_name' | 'source_alias';

export interface ProviderReportParams {
  startDate: string;
  endDate: string;
  vendorUniqueId?: string;
  status?: string;
  /** Column to group summary results by. Must be a valid column name. */
  groupBy?: ProviderGroupBy;
  page?: number;
  perPage?: number;
}
