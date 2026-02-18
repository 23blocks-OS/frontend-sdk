import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  VendorPayment,
  CreateVendorPaymentRequest,
  UpdateVendorPaymentRequest,
  PayVendorPaymentRequest,
  OrderDetailVendor,
  CreateOrderDetailVendorRequest,
  UpdateOrderDetailVendorRequest,
} from '../types/vendor-payment.js';
import type {
  VendorPaymentReportSummary,
  VendorPaymentReportList,
  VendorPaymentReportParams,
  ProviderReportSummary,
  ProviderReportList,
  ProviderReportParams,
} from '../types/report.js';
import { vendorPaymentMapper } from '../mappers/vendor-payment.mapper.js';
import { orderDetailVendorMapper } from '../mappers/order-detail-vendor.mapper.js';

function buildVendorPaymentBody(data: CreateVendorPaymentRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.vendorUniqueId) body['vendor_unique_id'] = data.vendorUniqueId;
  if (data.vendorName) body['vendor_name'] = data.vendorName;
  if (data.vendorEmail) body['vendor_email'] = data.vendorEmail;
  if (data.vendorPhone) body['vendor_phone'] = data.vendorPhone;
  if (data.vendorContact) body['vendor_contact'] = data.vendorContact;
  if (data.paymentType) body['payment_type'] = data.paymentType;
  if (data.price !== undefined) body['price'] = data.price;
  if (data.discount !== undefined) body['discount'] = data.discount;
  if (data.discountValue !== undefined) body['discount_value'] = data.discountValue;
  if (data.fees !== undefined) body['fees'] = data.fees;
  if (data.feesValue !== undefined) body['fees_value'] = data.feesValue;
  if (data.tips !== undefined) body['tips'] = data.tips;
  if (data.tipsValue !== undefined) body['tips_value'] = data.tipsValue;
  if (data.subtotal !== undefined) body['subtotal'] = data.subtotal;
  if (data.delivery !== undefined) body['delivery'] = data.delivery;
  if (data.tax !== undefined) body['tax'] = data.tax;
  if (data.taxValue !== undefined) body['tax_value'] = data.taxValue;
  if (data.payload) body['payload'] = data.payload;
  return body;
}

function buildPayBody(data: PayVendorPaymentRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.paymentType) body['payment_type'] = data.paymentType;
  if (data.gatewayUniqueId) body['gateway_unique_id'] = data.gatewayUniqueId;
  if (data.gatewayName) body['gateway_name'] = data.gatewayName;
  if (data.gatewayReference) body['gateway_reference'] = data.gatewayReference;
  if (data.gatewayOrderId) body['gateway_order_id'] = data.gatewayOrderId;
  if (data.gatewayFranchise) body['gateway_franchise'] = data.gatewayFranchise;
  if (data.gatewayPaymentType) body['gateway_payment_type'] = data.gatewayPaymentType;
  if (data.gatewayTransactionId) body['gateway_transaction_id'] = data.gatewayTransactionId;
  if (data.gatewayDescription) body['gateway_description'] = data.gatewayDescription;
  if (data.gatewayFees !== undefined) body['gateway_fees'] = data.gatewayFees;
  if (data.gatewayFeesValue !== undefined) body['gateway_fees_value'] = data.gatewayFeesValue;
  if (data.gatewayTips !== undefined) body['gateway_tips'] = data.gatewayTips;
  if (data.gatewayTipsValue !== undefined) body['gateway_tips_value'] = data.gatewayTipsValue;
  if (data.gatewaySubtotal !== undefined) body['gateway_subtotal'] = data.gatewaySubtotal;
  if (data.gatewayDiscount !== undefined) body['gateway_discount'] = data.gatewayDiscount;
  if (data.gatewayDiscountValue !== undefined) body['gateway_discount_value'] = data.gatewayDiscountValue;
  if (data.gatewayDelivery !== undefined) body['gateway_delivery'] = data.gatewayDelivery;
  if (data.gatewayTax !== undefined) body['gateway_tax'] = data.gatewayTax;
  if (data.gatewayTaxValue !== undefined) body['gateway_tax_value'] = data.gatewayTaxValue;
  if (data.gatewayTotal !== undefined) body['gateway_total'] = data.gatewayTotal;
  if (data.gatewayBalance !== undefined) body['gateway_balance'] = data.gatewayBalance;
  if (data.gatewayPaidAt) body['gateway_paid_at'] = data.gatewayPaidAt;
  if (data.gatewayStatus) body['gateway_status'] = data.gatewayStatus;
  if (data.gatewayResponse) body['gateway_response'] = data.gatewayResponse;
  if (data.gatewayPayload) body['gateway_payload'] = data.gatewayPayload;
  if (data.paidAt) body['paid_at'] = data.paidAt;
  return body;
}

function buildProviderBody(data: CreateOrderDetailVendorRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.vendorUniqueId) body['vendor_unique_id'] = data.vendorUniqueId;
  if (data.vendorName) body['vendor_name'] = data.vendorName;
  if (data.vendorEmail) body['vendor_email'] = data.vendorEmail;
  if (data.vendorPhone) body['vendor_phone'] = data.vendorPhone;
  if (data.vendorContact) body['vendor_contact'] = data.vendorContact;
  if (data.status) body['status'] = data.status;
  if (data.referredBy) body['referred_by'] = data.referredBy;
  if (data.promoCode) body['promo_code'] = data.promoCode;
  return body;
}

export interface VendorPaymentsService {
  get(paymentUniqueId: string): Promise<VendorPayment>;
  create(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, data: CreateVendorPaymentRequest): Promise<VendorPayment>;
  update(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string, data: UpdateVendorPaymentRequest): Promise<VendorPayment>;
  pay(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string, data?: PayVendorPaymentRequest): Promise<VendorPayment>;
  delete(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string): Promise<void>;
  createProvider(orderUniqueId: string, orderDetailUniqueId: string, data: CreateOrderDetailVendorRequest): Promise<OrderDetailVendor>;
  updateProvider(orderUniqueId: string, orderDetailUniqueId: string, providerUniqueId: string, data: UpdateOrderDetailVendorRequest): Promise<OrderDetailVendor>;
  reportList(params: VendorPaymentReportParams): Promise<VendorPaymentReportList>;
  reportSummary(params: VendorPaymentReportParams): Promise<VendorPaymentReportSummary>;
  providerReportList(params: ProviderReportParams): Promise<ProviderReportList>;
  providerReportSummary(params: ProviderReportParams): Promise<ProviderReportSummary>;
}

export function createVendorPaymentsService(transport: Transport, _config: { appId: string }): VendorPaymentsService {
  return {
    async get(paymentUniqueId: string): Promise<VendorPayment> {
      const response = await transport.get<unknown>(`/payables/${paymentUniqueId}`);
      return decodeOne(response, vendorPaymentMapper);
    },

    async create(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, data: CreateVendorPaymentRequest): Promise<VendorPayment> {
      const response = await transport.post<unknown>(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments`, {
        payment: buildVendorPaymentBody(data),
      });
      return decodeOne(response, vendorPaymentMapper);
    },

    async update(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string, data: UpdateVendorPaymentRequest): Promise<VendorPayment> {
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments/${paymentUniqueId}`, {
        payment: buildVendorPaymentBody(data),
      });
      return decodeOne(response, vendorPaymentMapper);
    },

    async pay(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string, data?: PayVendorPaymentRequest): Promise<VendorPayment> {
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments/${paymentUniqueId}/pay`, {
        payment: data ? buildPayBody(data) : {},
      });
      return decodeOne(response, vendorPaymentMapper);
    },

    async delete(orderUniqueId: string, detailUniqueId: string, vendorUniqueId: string, paymentUniqueId: string): Promise<void> {
      await transport.delete(`/orders/${orderUniqueId}/details/${detailUniqueId}/vendors/${vendorUniqueId}/payments/${paymentUniqueId}`);
    },

    async createProvider(orderUniqueId: string, orderDetailUniqueId: string, data: CreateOrderDetailVendorRequest): Promise<OrderDetailVendor> {
      const response = await transport.post<unknown>(`/orders/${orderUniqueId}/details/${orderDetailUniqueId}/providers`, {
        provider: buildProviderBody(data),
      });
      return decodeOne(response, orderDetailVendorMapper);
    },

    async updateProvider(orderUniqueId: string, orderDetailUniqueId: string, providerUniqueId: string, data: UpdateOrderDetailVendorRequest): Promise<OrderDetailVendor> {
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/details/${orderDetailUniqueId}/providers/${providerUniqueId}`, {
        provider: buildProviderBody(data),
      });
      return decodeOne(response, orderDetailVendorMapper);
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
          page: response.meta.current_page,
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
        group_by: params.groupBy,
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
          page: response.meta.current_page,
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
        group_by: params.groupBy,
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
