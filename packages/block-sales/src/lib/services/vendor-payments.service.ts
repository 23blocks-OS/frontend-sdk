import type { Transport, PageResult } from '@23blocks/contracts';
import type {
  VendorPayment,
  CreateVendorPaymentRequest,
  UpdateVendorPaymentRequest,
  OrderDetailVendor,
  CreateOrderDetailVendorRequest,
  UpdateOrderDetailVendorRequest,
  CreateOrderDetailVendorBySourceRequest,
} from '../types/vendor-payment';
import type {
  VendorPaymentReportSummary,
  VendorPaymentReportList,
  VendorPaymentReportParams,
  ProviderReportSummary,
  ProviderReportList,
  ProviderReportParams,
} from '../types/report';

export interface VendorPaymentsService {
  get(paymentUniqueId: string): Promise<VendorPayment>;
  create(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, data: CreateVendorPaymentRequest): Promise<VendorPayment>;
  update(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string, data: UpdateVendorPaymentRequest): Promise<VendorPayment>;
  pay(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string): Promise<VendorPayment>;
  delete(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string): Promise<void>;
  createProvider(orderUniqueId: string, orderDetailUniqueId: string, data: CreateOrderDetailVendorRequest): Promise<OrderDetailVendor>;
  createProviderBySource(sourceId: string, data: CreateOrderDetailVendorBySourceRequest): Promise<OrderDetailVendor>;
  updateProvider(orderUniqueId: string, orderDetailUniqueId: string, providerUniqueId: string, data: UpdateOrderDetailVendorRequest): Promise<OrderDetailVendor>;
  reportList(params: VendorPaymentReportParams): Promise<VendorPaymentReportList>;
  reportSummary(params: VendorPaymentReportParams): Promise<VendorPaymentReportSummary>;
  providerReportList(params: ProviderReportParams): Promise<ProviderReportList>;
  providerReportSummary(params: ProviderReportParams): Promise<ProviderReportSummary>;
}

export function createVendorPaymentsService(transport: Transport, _config: { appId: string }): VendorPaymentsService {
  return {
    async get(paymentUniqueId: string): Promise<VendorPayment> {
      const response = await transport.get<any>(`/payables/${paymentUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        orderUniqueId: response.order_unique_id,
        detailUniqueId: response.detail_unique_id,
        vendorUniqueId: response.vendor_unique_id,
        amount: response.amount,
        currency: response.currency,
        status: response.status,
        paidAt: response.paid_at ? new Date(response.paid_at) : undefined,
        reference: response.reference,
        notes: response.notes,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async create(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, data: CreateVendorPaymentRequest): Promise<VendorPayment> {
      const response = await transport.post<any>(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments`, {
        payment: {
          amount: data.amount,
          currency: data.currency,
          reference: data.reference,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        orderUniqueId: response.order_unique_id,
        detailUniqueId: response.detail_unique_id,
        vendorUniqueId: response.vendor_unique_id,
        amount: response.amount,
        currency: response.currency,
        status: response.status,
        paidAt: response.paid_at ? new Date(response.paid_at) : undefined,
        reference: response.reference,
        notes: response.notes,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async update(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string, data: UpdateVendorPaymentRequest): Promise<VendorPayment> {
      const response = await transport.put<any>(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments/${paymentUniqueId}`, {
        payment: {
          amount: data.amount,
          reference: data.reference,
          notes: data.notes,
          status: data.status,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        orderUniqueId: response.order_unique_id,
        detailUniqueId: response.detail_unique_id,
        vendorUniqueId: response.vendor_unique_id,
        amount: response.amount,
        currency: response.currency,
        status: response.status,
        paidAt: response.paid_at ? new Date(response.paid_at) : undefined,
        reference: response.reference,
        notes: response.notes,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async pay(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string): Promise<VendorPayment> {
      const response = await transport.put<any>(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments/${paymentUniqueId}/pay`, {});
      return {
        id: response.id,
        uniqueId: response.unique_id,
        orderUniqueId: response.order_unique_id,
        detailUniqueId: response.detail_unique_id,
        vendorUniqueId: response.vendor_unique_id,
        amount: response.amount,
        currency: response.currency,
        status: response.status,
        paidAt: response.paid_at ? new Date(response.paid_at) : undefined,
        reference: response.reference,
        notes: response.notes,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async delete(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string): Promise<void> {
      await transport.delete(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments/${paymentUniqueId}`);
    },

    async createProvider(orderUniqueId: string, orderDetailUniqueId: string, data: CreateOrderDetailVendorRequest): Promise<OrderDetailVendor> {
      const response = await transport.post<any>(`/orders/${orderUniqueId}/details/${orderDetailUniqueId}/providers`, {
        provider: {
          vendor_unique_id: data.vendorUniqueId,
          amount: data.amount,
          commission: data.commission,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        orderDetailUniqueId: response.order_detail_unique_id,
        vendorUniqueId: response.vendor_unique_id,
        vendorName: response.vendor_name,
        amount: response.amount,
        commission: response.commission,
        status: response.status,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async createProviderBySource(sourceId: string, data: CreateOrderDetailVendorBySourceRequest): Promise<OrderDetailVendor> {
      const response = await transport.post<any>(`/sources/${sourceId}/providers`, {
        provider: {
          vendor_unique_id: data.vendorUniqueId,
          order_unique_id: data.orderUniqueId,
          order_detail_unique_id: data.orderDetailUniqueId,
          amount: data.amount,
          commission: data.commission,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        sourceId: response.source_id,
        orderDetailUniqueId: response.order_detail_unique_id,
        vendorUniqueId: response.vendor_unique_id,
        vendorName: response.vendor_name,
        amount: response.amount,
        commission: response.commission,
        status: response.status,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async updateProvider(orderUniqueId: string, orderDetailUniqueId: string, providerUniqueId: string, data: UpdateOrderDetailVendorRequest): Promise<OrderDetailVendor> {
      const response = await transport.put<any>(`/orders/${orderUniqueId}/details/${orderDetailUniqueId}/providers/${providerUniqueId}`, {
        provider: {
          amount: data.amount,
          commission: data.commission,
          status: data.status,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        orderDetailUniqueId: response.order_detail_unique_id,
        vendorUniqueId: response.vendor_unique_id,
        vendorName: response.vendor_name,
        amount: response.amount,
        commission: response.commission,
        status: response.status,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async reportList(params: VendorPaymentReportParams): Promise<VendorPaymentReportList> {
      const response = await transport.post<any>('/reports/vendors/payments/list', {
        start_date: params.startDate,
        end_date: params.endDate,
        vendor_unique_id: params.vendorUniqueId,
        status: params.status,
        page: params.page,
        per_page: params.perPage,
      });
      return {
        payments: (response.payments || []).map((p: any) => ({
          uniqueId: p.unique_id,
          orderUniqueId: p.order_unique_id,
          vendorName: p.vendor_name,
          amount: p.amount,
          status: p.status,
          paidAt: p.paid_at ? new Date(p.paid_at) : undefined,
          createdAt: new Date(p.created_at),
        })),
        summary: {
          totalPayments: response.summary.total_payments,
          totalAmount: response.summary.total_amount,
          totalPending: response.summary.total_pending,
          totalPaid: response.summary.total_paid,
          paymentsByStatus: response.summary.payments_by_status,
          currency: response.summary.currency,
          period: {
            startDate: new Date(response.summary.period.start_date),
            endDate: new Date(response.summary.period.end_date),
          },
        },
        meta: {
          totalCount: response.meta.total_count,
          page: response.meta.page,
          perPage: response.meta.per_page,
          totalPages: response.meta.total_pages,
        },
      };
    },

    async reportSummary(params: VendorPaymentReportParams): Promise<VendorPaymentReportSummary> {
      const response = await transport.post<any>('/reports/vendors/payments/summary', {
        start_date: params.startDate,
        end_date: params.endDate,
        vendor_unique_id: params.vendorUniqueId,
        status: params.status,
      });
      return {
        totalPayments: response.total_payments,
        totalAmount: response.total_amount,
        totalPending: response.total_pending,
        totalPaid: response.total_paid,
        paymentsByStatus: response.payments_by_status,
        currency: response.currency,
        period: {
          startDate: new Date(response.period.start_date),
          endDate: new Date(response.period.end_date),
        },
      };
    },

    async providerReportList(params: ProviderReportParams): Promise<ProviderReportList> {
      const response = await transport.post<any>('/reports/orders/providers/list', {
        start_date: params.startDate,
        end_date: params.endDate,
        vendor_unique_id: params.vendorUniqueId,
        status: params.status,
        page: params.page,
        per_page: params.perPage,
      });
      return {
        providers: (response.providers || []).map((p: any) => ({
          uniqueId: p.unique_id,
          vendorName: p.vendor_name,
          amount: p.amount,
          commission: p.commission,
          status: p.status,
          createdAt: new Date(p.created_at),
        })),
        summary: {
          totalProviders: response.summary.total_providers,
          totalAmount: response.summary.total_amount,
          totalCommission: response.summary.total_commission,
          providersByStatus: response.summary.providers_by_status,
          period: {
            startDate: new Date(response.summary.period.start_date),
            endDate: new Date(response.summary.period.end_date),
          },
        },
        meta: {
          totalCount: response.meta.total_count,
          page: response.meta.page,
          perPage: response.meta.per_page,
          totalPages: response.meta.total_pages,
        },
      };
    },

    async providerReportSummary(params: ProviderReportParams): Promise<ProviderReportSummary> {
      const response = await transport.post<any>('/reports/orders/providers/summary', {
        start_date: params.startDate,
        end_date: params.endDate,
        vendor_unique_id: params.vendorUniqueId,
        status: params.status,
      });
      return {
        totalProviders: response.total_providers,
        totalAmount: response.total_amount,
        totalCommission: response.total_commission,
        providersByStatus: response.providers_by_status,
        period: {
          startDate: new Date(response.period.start_date),
          endDate: new Date(response.period.end_date),
        },
      };
    },
  };
}
