import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Payment, CreatePaymentRequest, CreatePaymentMethodRequest, ListPaymentsParams } from '../types/payment.js';
import { paymentMapper } from '../mappers/payment.mapper.js';

function buildPaymentBody(data: CreatePaymentRequest): Record<string, unknown> {
  const payment: Record<string, unknown> = {};
  if (data.gatewayUniqueId) payment['gateway_unique_id'] = data.gatewayUniqueId;
  if (data.gatewayName) payment['gateway_name'] = data.gatewayName;
  if (data.gatewayReference) payment['gateway_reference'] = data.gatewayReference;
  if (data.gatewayOrderId) payment['gateway_order_id'] = data.gatewayOrderId;
  if (data.gatewayFranchise) payment['gateway_franchise'] = data.gatewayFranchise;
  if (data.gatewayPaymentType) payment['gateway_payment_type'] = data.gatewayPaymentType;
  if (data.gatewayTransactionId) payment['gateway_transaction_id'] = data.gatewayTransactionId;
  if (data.gatewayDescription) payment['gateway_description'] = data.gatewayDescription;
  if (data.gatewaySubtotal !== undefined) payment['gateway_subtotal'] = data.gatewaySubtotal;
  if (data.gatewayDiscount !== undefined) payment['gateway_discount'] = data.gatewayDiscount;
  if (data.gatewayDiscountValue !== undefined) payment['gateway_discount_value'] = data.gatewayDiscountValue;
  if (data.gatewayDelivery !== undefined) payment['gateway_delivery'] = data.gatewayDelivery;
  if (data.gatewayTax !== undefined) payment['gateway_tax'] = data.gatewayTax;
  if (data.gatewayTaxValue !== undefined) payment['gateway_tax_value'] = data.gatewayTaxValue;
  if (data.gatewayFees !== undefined) payment['gateway_fees'] = data.gatewayFees;
  if (data.gatewayFeesValue !== undefined) payment['gateway_fees_value'] = data.gatewayFeesValue;
  if (data.gatewayTips !== undefined) payment['gateway_tips'] = data.gatewayTips;
  if (data.gatewayTipsValue !== undefined) payment['gateway_tips_value'] = data.gatewayTipsValue;
  if (data.gatewayTotal !== undefined) payment['gateway_total'] = data.gatewayTotal;
  if (data.gatewayBalance !== undefined) payment['gateway_balance'] = data.gatewayBalance;
  if (data.gatewayPaidAt) payment['gateway_paid_at'] = data.gatewayPaidAt;
  if (data.gatewayStatus) payment['gateway_status'] = data.gatewayStatus;
  if (data.gatewayResponse) payment['gateway_response'] = data.gatewayResponse;
  if (data.paymentType) payment['payment_type'] = data.paymentType;
  return payment;
}

export interface PaymentsService {
  list(params?: ListPaymentsParams): Promise<PageResult<Payment>>;
  get(uniqueId: string): Promise<Payment>;
  create(orderUniqueId: string, data: CreatePaymentRequest): Promise<Payment>;
  createPaymentMethod(orderUniqueId: string, data: CreatePaymentMethodRequest): Promise<Payment>;
  listByOrder(orderUniqueId: string): Promise<Payment[]>;
}

export function createPaymentsService(transport: Transport, _config: { apiKey: string }): PaymentsService {
  return {
    async list(params?: ListPaymentsParams): Promise<PageResult<Payment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.orderUniqueId) queryParams['order_unique_id'] = params.orderUniqueId;
      if (params?.paymentType) queryParams['payment_type'] = params.paymentType;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/payments', { params: queryParams });
      return decodePageResult(response, paymentMapper);
    },

    async get(uniqueId: string): Promise<Payment> {
      const response = await transport.get<unknown>(`/payments/${uniqueId}`);
      return decodeOne(response, paymentMapper);
    },

    async create(orderUniqueId: string, data: CreatePaymentRequest): Promise<Payment> {
      const response = await transport.post<unknown>(`/orders/${orderUniqueId}/payments`, {
        payment: buildPaymentBody(data),
      });
      return decodeOne(response, paymentMapper);
    },

    async createPaymentMethod(orderUniqueId: string, data: CreatePaymentMethodRequest): Promise<Payment> {
      const body: Record<string, unknown> = {};
      if (data.paymentType) body['payment_type'] = data.paymentType;
      if (data.city) body['city'] = data.city;
      if (data.country) body['country'] = data.country;
      if (data.line1) body['line1'] = data.line1;
      if (data.line2) body['line2'] = data.line2;
      if (data.postalCode) body['postal_code'] = data.postalCode;
      if (data.state) body['state'] = data.state;
      if (data.brand) body['brand'] = data.brand;
      if (data.cardCountry) body['card_country'] = data.cardCountry;
      if (data.expMonth) body['exp_month'] = data.expMonth;
      if (data.expYear) body['exp_year'] = data.expYear;
      if (data.fingerprint) body['fingerprint'] = data.fingerprint;
      if (data.last4) body['last4'] = data.last4;
      if (data.paymentProcessorName) body['payment_processor_name'] = data.paymentProcessorName;
      if (data.paymentProcessorId) body['payment_processor_id'] = data.paymentProcessorId;
      if (data.customerUniqueId) body['customer_unique_id'] = data.customerUniqueId;
      if (data.customerName) body['customer_name'] = data.customerName;
      if (data.customerEmail) body['customer_email'] = data.customerEmail;
      if (data.bankName) body['bank_name'] = data.bankName;
      if (data.accountNumber) body['account_number'] = data.accountNumber;
      const response = await transport.post<unknown>(`/orders/${orderUniqueId}/payments/method`, {
        payment: body,
      });
      return decodeOne(response, paymentMapper);
    },

    async listByOrder(orderUniqueId: string): Promise<Payment[]> {
      const response = await transport.get<unknown>(`/orders/${orderUniqueId}/payments`);
      return decodeMany(response, paymentMapper);
    },
  };
}
