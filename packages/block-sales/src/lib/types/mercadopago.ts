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

export interface MercadoPagoPaymentIntent {
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

export interface CreateMercadoPagoPaymentRequest {
  transactionAmount: number;
  description?: string;
  paymentMethodId?: string;
  payerEmail: string;
  installments?: number;
  token?: string;
  issuerId?: string;
  externalReference?: string;
  statementDescriptor?: string;
  notificationUrl?: string;
  additionalInfo?: {
    items?: MercadoPagoItem[];
    payer?: MercadoPagoPayer;
  };
  metadata?: Record<string, unknown>;
}

export interface MercadoPagoItem {
  id?: string;
  title: string;
  description?: string;
  pictureUrl?: string;
  categoryId?: string;
  quantity: number;
  unitPrice: number;
}

export interface MercadoPagoPayer {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: {
    areaCode?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    zipCode?: string;
    streetName?: string;
    streetNumber?: string;
  };
}

export interface CreateMercadoPagoPSERequest {
  transactionAmount: number;
  description?: string;
  payerEmail: string;
  payerDocumentType: string;
  payerDocumentNumber: string;
  financialInstitution: string;
  callbackUrl: string;
  externalReference?: string;
  metadata?: Record<string, unknown>;
}
