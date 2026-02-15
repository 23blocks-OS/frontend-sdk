import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  MercadoPagoPaymentMethod,
  MercadoPagoPaymentIntent,
  CreateMercadoPagoPaymentRequest,
  CreateMercadoPagoPSERequest,
} from '../types/mercadopago.js';
import { mercadoPagoPaymentMethodMapper, mercadoPagoPaymentIntentMapper } from '../mappers/mercadopago.mapper.js';

export interface MercadoPagoService {
  /**
   * List available MercadoPago payment methods.
   * @returns Array of MercadoPagoPaymentMethod records.
   */
  listPaymentMethods(): Promise<MercadoPagoPaymentMethod[]>;

  /**
   * Create a MercadoPago payment intent.
   * @returns MercadoPagoPaymentIntent with status, amounts, and redirect URLs.
   */
  createPaymentIntent(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPaymentIntent>;

  /**
   * Create a MercadoPago PSE (bank transfer) payment intent.
   * @returns MercadoPagoPaymentIntent with PSE-specific redirect URLs.
   */
  createPSEIntent(data: CreateMercadoPagoPSERequest): Promise<MercadoPagoPaymentIntent>;
}

export function createMercadoPagoService(transport: Transport, _config: { appId: string }): MercadoPagoService {
  return {
    async listPaymentMethods(): Promise<MercadoPagoPaymentMethod[]> {
      const response = await transport.get<unknown>('/mercadopago');
      return decodeMany(response, mercadoPagoPaymentMethodMapper);
    },

    async createPaymentIntent(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPaymentIntent> {
      const response = await transport.post<unknown>('/mercadopago/payments', {
        transaction_amount: data.transactionAmount,
        description: data.description,
        payment_method_id: data.paymentMethodId,
        payer: {
          email: data.payerEmail,
        },
        installments: data.installments,
        token: data.token,
        issuer_id: data.issuerId,
        external_reference: data.externalReference,
        statement_descriptor: data.statementDescriptor,
        notification_url: data.notificationUrl,
        additional_info: data.additionalInfo ? {
          items: data.additionalInfo.items?.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            picture_url: item.pictureUrl,
            category_id: item.categoryId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
          payer: data.additionalInfo.payer ? {
            first_name: data.additionalInfo.payer.firstName,
            last_name: data.additionalInfo.payer.lastName,
            email: data.additionalInfo.payer.email,
            phone: data.additionalInfo.payer.phone,
            identification: data.additionalInfo.payer.identification,
            address: data.additionalInfo.payer.address ? {
              zip_code: data.additionalInfo.payer.address.zipCode,
              street_name: data.additionalInfo.payer.address.streetName,
              street_number: data.additionalInfo.payer.address.streetNumber,
            } : undefined,
          } : undefined,
        } : undefined,
        metadata: data.metadata,
      });
      return decodeOne(response, mercadoPagoPaymentIntentMapper);
    },

    async createPSEIntent(data: CreateMercadoPagoPSERequest): Promise<MercadoPagoPaymentIntent> {
      const response = await transport.post<unknown>('/mercadopago/payments/pse', {
        transaction_amount: data.transactionAmount,
        description: data.description,
        payer: {
          email: data.payerEmail,
          identification: {
            type: data.payerDocumentType,
            number: data.payerDocumentNumber,
          },
        },
        transaction_details: {
          financial_institution: data.financialInstitution,
        },
        callback_url: data.callbackUrl,
        external_reference: data.externalReference,
        metadata: data.metadata,
      });
      return decodeOne(response, mercadoPagoPaymentIntentMapper);
    },
  };
}
