import type { IdentityCore } from '@23blocks/contracts';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment extends IdentityCore {
  orderUniqueId: string;
  paymentMethod: string;
  paymentProvider: string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreatePaymentRequest {
  orderUniqueId: string;
  paymentMethod: string;
  paymentProvider: string;
  amount: number;
  currency: string;
  transactionId?: string;
  payload?: Record<string, unknown>;
}

export interface ListPaymentsParams {
  page?: number;
  perPage?: number;
  status?: PaymentStatus;
  orderUniqueId?: string;
  paymentMethod?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
