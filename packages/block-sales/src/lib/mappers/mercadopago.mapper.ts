import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type {
  MercadoPagoPaymentMethod,
  MercadoPagoPayment,
} from '../types/mercadopago.js';
import { parseDate, parseNumber, parseOptionalNumber, parseStringArray } from './utils.js';

export const mercadoPagoPaymentMethodMapper: ResourceMapper<MercadoPagoPaymentMethod> = {
  type: 'MercadoPagoPaymentMethod',
  map: (resource) => ({
    id: resource.id,
    name: resource.attributes['name'] as string,
    paymentTypeId: resource.attributes['payment_type_id'] as string,
    status: resource.attributes['status'] as string,
    secureThumbnail: resource.attributes['secure_thumbnail'] as string | undefined,
    thumbnail: resource.attributes['thumbnail'] as string | undefined,
    deferredCapture: resource.attributes['deferred_capture'] as string,
    settings: resource.attributes['settings'] as Record<string, unknown>[] | undefined,
    additionalInfoNeeded: parseStringArray(resource.attributes['additional_info_needed']),
    minAllowedAmount: parseOptionalNumber(resource.attributes['min_allowed_amount']),
    maxAllowedAmount: parseOptionalNumber(resource.attributes['max_allowed_amount']),
    processingModes: parseStringArray(resource.attributes['processing_modes']),
  }),
};

export const mercadoPagoPaymentMapper: ResourceMapper<MercadoPagoPayment> = {
  type: 'MercadoPagoPaymentIntent',
  map: (resource) => ({
    id: resource.id,
    status: resource.attributes['status'] as string,
    statusDetail: resource.attributes['status_detail'] as string | undefined,
    externalReference: resource.attributes['external_reference'] as string | undefined,
    transactionAmount: parseNumber(resource.attributes['transaction_amount']),
    currencyId: resource.attributes['currency_id'] as string,
    paymentMethodId: resource.attributes['payment_method_id'] as string | undefined,
    paymentTypeId: resource.attributes['payment_type_id'] as string | undefined,
    installments: parseOptionalNumber(resource.attributes['installments']),
    initPoint: resource.attributes['init_point'] as string | undefined,
    qrCodeBase64: resource.attributes['qr_code_base64'] as string | undefined,
    ticketUrl: resource.attributes['ticket_url'] as string | undefined,
    dateCreated: parseDate(resource.attributes['date_created']) ?? new Date(),
    dateApproved: parseDate(resource.attributes['date_approved']),
  }),
};
