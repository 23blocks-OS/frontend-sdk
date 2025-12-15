import type { Transport } from '@23blocks/contracts';
import type {
  MercadoPagoPaymentMethod,
  MercadoPagoPaymentIntent,
  CreateMercadoPagoPaymentRequest,
  CreateMercadoPagoPSERequest,
} from '../types/mercadopago';

export interface MercadoPagoService {
  listPaymentMethods(): Promise<MercadoPagoPaymentMethod[]>;
  createPaymentIntent(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPaymentIntent>;
  createPSEIntent(data: CreateMercadoPagoPSERequest): Promise<MercadoPagoPaymentIntent>;
}

export function createMercadoPagoService(transport: Transport, _config: { appId: string }): MercadoPagoService {
  return {
    async listPaymentMethods(): Promise<MercadoPagoPaymentMethod[]> {
      const response = await transport.get<any>('/mercadopago');
      return (response.payment_methods || response || []).map((pm: any) => ({
        id: pm.id,
        name: pm.name,
        paymentTypeId: pm.payment_type_id,
        status: pm.status,
        secureThumbnail: pm.secure_thumbnail,
        thumbnail: pm.thumbnail,
        deferredCapture: pm.deferred_capture,
        settings: pm.settings,
        additionalInfoNeeded: pm.additional_info_needed,
        minAllowedAmount: pm.min_allowed_amount,
        maxAllowedAmount: pm.max_allowed_amount,
        processingModes: pm.processing_modes,
      }));
    },

    async createPaymentIntent(data: CreateMercadoPagoPaymentRequest): Promise<MercadoPagoPaymentIntent> {
      const response = await transport.post<any>('/mercadopago/payments', {
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
      return {
        id: response.id,
        status: response.status,
        statusDetail: response.status_detail,
        externalReference: response.external_reference,
        transactionAmount: response.transaction_amount,
        currencyId: response.currency_id,
        paymentMethodId: response.payment_method_id,
        paymentTypeId: response.payment_type_id,
        installments: response.installments,
        initPoint: response.init_point,
        qrCodeBase64: response.qr_code_base64,
        ticketUrl: response.ticket_url,
        dateCreated: new Date(response.date_created),
        dateApproved: response.date_approved ? new Date(response.date_approved) : undefined,
      };
    },

    async createPSEIntent(data: CreateMercadoPagoPSERequest): Promise<MercadoPagoPaymentIntent> {
      const response = await transport.post<any>('/mercadopago/payments/pse', {
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
      return {
        id: response.id,
        status: response.status,
        statusDetail: response.status_detail,
        externalReference: response.external_reference,
        transactionAmount: response.transaction_amount,
        currencyId: response.currency_id,
        paymentMethodId: response.payment_method_id,
        paymentTypeId: response.payment_type_id,
        initPoint: response.init_point,
        ticketUrl: response.ticket_url,
        dateCreated: new Date(response.date_created),
        dateApproved: response.date_approved ? new Date(response.date_approved) : undefined,
      };
    },
  };
}
