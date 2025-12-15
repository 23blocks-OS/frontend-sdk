import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FlexibleOrder,
  CreateFlexibleOrderRequest,
  UpdateFlexibleOrderRequest,
  AddFlexibleOrderDetailRequest,
  AddFlexibleOrderTipsRequest,
  AddFlexibleOrderPaymentMethodRequest,
  AddFlexibleOrderPaymentRequest,
  UpdateFlexibleOrderLogisticsRequest,
  ListFlexibleOrdersParams,
} from '../types/flexible-order';
import type { Payment } from '../types/payment';
import { flexibleOrderMapper } from '../mappers/flexible-order.mapper';
import { paymentMapper } from '../mappers/payment.mapper';

export interface FlexibleOrdersService {
  list(params?: ListFlexibleOrdersParams): Promise<PageResult<FlexibleOrder>>;
  get(uniqueId: string): Promise<FlexibleOrder>;
  create(data: CreateFlexibleOrderRequest): Promise<FlexibleOrder>;
  update(uniqueId: string, data: UpdateFlexibleOrderRequest): Promise<FlexibleOrder>;
  addDetails(uniqueId: string, data: AddFlexibleOrderDetailRequest): Promise<FlexibleOrder>;
  addTips(uniqueId: string, data: AddFlexibleOrderTipsRequest): Promise<FlexibleOrder>;
  addPaymentMethod(uniqueId: string, data: AddFlexibleOrderPaymentMethodRequest): Promise<FlexibleOrder>;
  addPayment(uniqueId: string, data: AddFlexibleOrderPaymentRequest): Promise<FlexibleOrder>;
  confirmPayment(uniqueId: string, paymentUniqueId: string): Promise<FlexibleOrder>;
  updateStatus(uniqueId: string, status: string): Promise<FlexibleOrder>;
  updateDetailStatus(uniqueId: string, detailUniqueId: string, status: string): Promise<FlexibleOrder>;
  cancel(uniqueId: string): Promise<void>;
  updateLogistics(uniqueId: string, data: UpdateFlexibleOrderLogisticsRequest): Promise<FlexibleOrder>;
  updateDetailLogistics(uniqueId: string, detailUniqueId: string, data: UpdateFlexibleOrderLogisticsRequest): Promise<FlexibleOrder>;
  getPayments(uniqueId: string): Promise<PageResult<Payment>>;
}

export function createFlexibleOrdersService(transport: Transport, _config: { appId: string }): FlexibleOrdersService {
  return {
    async list(params?: ListFlexibleOrdersParams): Promise<PageResult<FlexibleOrder>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.customerUniqueId) queryParams['customer_unique_id'] = params.customerUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/flexible_orders', { params: queryParams });
      return decodePageResult(response, flexibleOrderMapper);
    },

    async get(uniqueId: string): Promise<FlexibleOrder> {
      const response = await transport.get<unknown>(`/flexible_orders/${uniqueId}`);
      return decodeOne(response, flexibleOrderMapper);
    },

    async create(data: CreateFlexibleOrderRequest): Promise<FlexibleOrder> {
      const response = await transport.post<unknown>('/flexible_orders', {
        flexible_order: {
          customer_unique_id: data.customerUniqueId,
          user_unique_id: data.userUniqueId,
          entity_unique_id: data.entityUniqueId,
          currency: data.currency,
          payload: data.payload,
        },
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async update(uniqueId: string, data: UpdateFlexibleOrderRequest): Promise<FlexibleOrder> {
      const response = await transport.put<unknown>(`/flexible_orders/${uniqueId}`, {
        flexible_order: {
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async addDetails(uniqueId: string, data: AddFlexibleOrderDetailRequest): Promise<FlexibleOrder> {
      const response = await transport.post<unknown>(`/flexible_orders/${uniqueId}/details`, {
        detail: {
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          unit_price: data.unitPrice,
          tax: data.tax,
          payload: data.payload,
        },
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async addTips(uniqueId: string, data: AddFlexibleOrderTipsRequest): Promise<FlexibleOrder> {
      const response = await transport.post<unknown>(`/flexible_orders/${uniqueId}/tips/add`, {
        amount: data.amount,
        payload: data.payload,
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async addPaymentMethod(uniqueId: string, data: AddFlexibleOrderPaymentMethodRequest): Promise<FlexibleOrder> {
      const response = await transport.post<unknown>(`/flexible_orders/${uniqueId}/payments/method`, {
        method: data.method,
        payload: data.payload,
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async addPayment(uniqueId: string, data: AddFlexibleOrderPaymentRequest): Promise<FlexibleOrder> {
      const response = await transport.post<unknown>(`/flexible_orders/${uniqueId}/payments`, {
        payment: {
          amount: data.amount,
          method: data.method,
          payload: data.payload,
        },
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async confirmPayment(uniqueId: string, paymentUniqueId: string): Promise<FlexibleOrder> {
      const response = await transport.put<unknown>(`/flexible_orders/${uniqueId}/payments/${paymentUniqueId}/confirm`, {});
      return decodeOne(response, flexibleOrderMapper);
    },

    async updateStatus(uniqueId: string, status: string): Promise<FlexibleOrder> {
      const response = await transport.put<unknown>(`/flexible_orders/${uniqueId}/status`, {
        status,
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async updateDetailStatus(uniqueId: string, detailUniqueId: string, status: string): Promise<FlexibleOrder> {
      const response = await transport.put<unknown>(`/flexible_orders/${uniqueId}/details/${detailUniqueId}/status`, {
        status,
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async cancel(uniqueId: string): Promise<void> {
      await transport.delete(`/flexible_orders/${uniqueId}/cancel`);
    },

    async updateLogistics(uniqueId: string, data: UpdateFlexibleOrderLogisticsRequest): Promise<FlexibleOrder> {
      const response = await transport.put<unknown>(`/flexible_orders/${uniqueId}/logistics`, {
        logistics: {
          carrier: data.carrier,
          tracking_number: data.trackingNumber,
          tracking_url: data.trackingUrl,
          shipped_at: data.shippedAt,
          delivered_at: data.deliveredAt,
          estimated_delivery: data.estimatedDelivery,
          address: data.address,
          payload: data.payload,
        },
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async updateDetailLogistics(uniqueId: string, detailUniqueId: string, data: UpdateFlexibleOrderLogisticsRequest): Promise<FlexibleOrder> {
      const response = await transport.put<unknown>(`/flexible_orders/${uniqueId}/details/${detailUniqueId}/logistics`, {
        logistics: {
          carrier: data.carrier,
          tracking_number: data.trackingNumber,
          tracking_url: data.trackingUrl,
          shipped_at: data.shippedAt,
          delivered_at: data.deliveredAt,
          estimated_delivery: data.estimatedDelivery,
          address: data.address,
          payload: data.payload,
        },
      });
      return decodeOne(response, flexibleOrderMapper);
    },

    async getPayments(uniqueId: string): Promise<PageResult<Payment>> {
      const response = await transport.get<unknown>(`/flexible_orders/${uniqueId}/payments`);
      return decodePageResult(response, paymentMapper);
    },
  };
}
