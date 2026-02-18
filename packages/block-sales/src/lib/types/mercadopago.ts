export interface MercadoPagoPaymentMethod {
  id: string;
  name: string;
  paymentTypeId: string;
  status: string;
  secureThumbnail?: string;
  thumbnail?: string;
  deferredCapture: string;
  settings?: Record<string, unknown>[];
  additionalInfoNeeded?: string[];
  minAllowedAmount?: number;
  maxAllowedAmount?: number;
  processingModes?: string[];
}

export interface MercadoPagoPayment {
  id: string;
  status: string;
  statusDetail?: string;
  externalReference?: string;
  transactionAmount: number;
  currencyId: string;
  paymentMethodId?: string;
  paymentTypeId?: string;
  installments?: number;
  initPoint?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
  dateCreated: Date;
  dateApproved?: Date;
}

/** Matches payment_params in mercado_pago_controller.rb */
export interface CreateMercadoPagoPaymentRequest {
  amount: number;
  cardToken?: string;
  description?: string;
  installments?: number;
  paymentMethodId?: string;
  email?: string;
  documentType?: string;
  documentNumber?: string;
  orderUniqueId?: string;
  displayUniqueId?: string;
  financialInstitution?: string;
  callbackUrl?: string;
}
