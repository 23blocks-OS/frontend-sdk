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

export interface OrderReportParams {
  startDate: string;
  endDate: string;
  status?: string;
  customerUniqueId?: string;
  userUniqueId?: string;
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

export interface VendorPaymentReportParams {
  startDate: string;
  endDate: string;
  vendorUniqueId?: string;
  status?: string;
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

export interface SubscriptionReportParams {
  startDate: string;
  endDate: string;
  status?: string;
  subscriptionModelUniqueId?: string;
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

export interface ProviderReportParams {
  startDate: string;
  endDate: string;
  vendorUniqueId?: string;
  status?: string;
  page?: number;
  perPage?: number;
}
