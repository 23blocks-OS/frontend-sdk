import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Payment, CreatePaymentRequest, ListPaymentsParams } from '../types/payment';
import { paymentMapper } from '../mappers/payment.mapper';

export interface PaymentsService {
  list(params?: ListPaymentsParams): Promise<PageResult<Payment>>;
  get(uniqueId: string): Promise<Payment>;
  create(data: CreatePaymentRequest): Promise<Payment>;
  refund(uniqueId: string, amount?: number): Promise<Payment>;
  listByOrder(orderUniqueId: string): Promise<Payment[]>;
}

export function createPaymentsService(transport: Transport, _config: { appId: string }): PaymentsService {
  return {
    async list(params?: ListPaymentsParams): Promise<PageResult<Payment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.orderUniqueId) queryParams['order_unique_id'] = params.orderUniqueId;
      if (params?.paymentMethod) queryParams['payment_method'] = params.paymentMethod;
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

    async create(data: CreatePaymentRequest): Promise<Payment> {
      const response = await transport.post<unknown>('/payments', {
        data: {
          type: 'Payment',
          attributes: {
            order_unique_id: data.orderUniqueId,
            payment_method: data.paymentMethod,
            payment_provider: data.paymentProvider,
            amount: data.amount,
            currency: data.currency,
            transaction_id: data.transactionId,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, paymentMapper);
    },

    async refund(uniqueId: string, amount?: number): Promise<Payment> {
      const response = await transport.put<unknown>(`/payments/${uniqueId}/refund`, {
        data: {
          type: 'Payment',
          attributes: {
            amount,
          },
        },
      });
      return decodeOne(response, paymentMapper);
    },

    async listByOrder(orderUniqueId: string): Promise<Payment[]> {
      const response = await transport.get<unknown>(`/orders/${orderUniqueId}/payments`);
      return decodeMany(response, paymentMapper);
    },
  };
}
