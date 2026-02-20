import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  MercadoPagoPaymentMethod,
  MercadoPagoPayment,
  CreateMercadoPagoPaymentRequest,
} from '../types/mercadopago.js';
import { mercadoPagoPaymentMethodMapper, mercadoPagoPaymentMapper } from '../mappers/mercadopago.mapper.js';

function buildMercadoPagoBody(data: CreateMercadoPagoPaymentRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.amount !== undefined) body['amount'] = data.amount;
  if (data.cardToken) body['card_token'] = data.cardToken;
  if (data.description) body['description'] = data.description;
  if (data.installments !== undefined) body['installments'] = data.installments;
  if (data.paymentMethodId) body['paymentMethodId'] = data.paymentMethodId;
  if (data.email) body['email'] = data.email;
  if (data.documentType) body['document_type'] = data.documentType;
  if (data.documentNumber) body['document_number'] = data.documentNumber;
  if (data.orderUniqueId) body['order_unique_id'] = data.orderUniqueId;
  if (data.displayUniqueId) body['display_unique_id'] = data.displayUniqueId;
  if (data.financialInstitution) body['financial_institution'] = data.financialInstitution;
  if (data.callbackUrl) body['callback_url'] = data.callbackUrl;
  return body;
}

export interface MercadoPagoService {
  listPaymentMethods(): Promise<MercadoPagoPaymentMethod[]>;
  createPayment(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPayment>;
  createPSEPayment(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPayment>;
}

export function createMercadoPagoService(transport: Transport, _config: { apiKey: string }): MercadoPagoService {
  return {
    async listPaymentMethods(): Promise<MercadoPagoPaymentMethod[]> {
      const response = await transport.get<unknown>('/mercadopago');
      return decodeMany(response, mercadoPagoPaymentMethodMapper);
    },

    async createPayment(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPayment> {
      const response = await transport.post<unknown>('/mercadopago/payments', {
        payment: buildMercadoPagoBody(data),
      });
      return decodeOne(response, mercadoPagoPaymentMapper);
    },

    async createPSEPayment(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPayment> {
      const response = await transport.post<unknown>('/mercadopago/payments/pse', {
        payment: buildMercadoPagoBody(data),
      });
      return decodeOne(response, mercadoPagoPaymentMapper);
    },
  };
}
