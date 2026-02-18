import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Payment } from '../types/payment.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const paymentMapper: ResourceMapper<Payment> = {
  type: 'Payment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    orderUniqueId: parseString(resource.attributes['order_unique_id']),
    paymentType: parseString(resource.attributes['payment_type']),
    gatewayUniqueId: parseString(resource.attributes['gateway_unique_id']),
    gatewayName: parseString(resource.attributes['gateway_name']),
    gatewayReference: parseString(resource.attributes['gateway_reference']),
    gatewayOrderId: parseString(resource.attributes['gateway_order_id']),
    gatewayFranchise: parseString(resource.attributes['gateway_franchise']),
    gatewayPaymentType: parseString(resource.attributes['gateway_payment_type']),
    gatewayTransactionId: parseString(resource.attributes['gateway_transaction_id']),
    gatewayDescription: parseString(resource.attributes['gateway_description']),
    gatewaySubtotal: parseNumber(resource.attributes['gateway_subtotal']) || undefined,
    gatewayDiscount: parseNumber(resource.attributes['gateway_discount']) || undefined,
    gatewayDiscountValue: parseNumber(resource.attributes['gateway_discount_value']) || undefined,
    gatewayDelivery: parseNumber(resource.attributes['gateway_delivery']) || undefined,
    gatewayTax: parseNumber(resource.attributes['gateway_tax']) || undefined,
    gatewayTaxValue: parseNumber(resource.attributes['gateway_tax_value']) || undefined,
    gatewayFees: parseNumber(resource.attributes['gateway_fees']) || undefined,
    gatewayFeesValue: parseNumber(resource.attributes['gateway_fees_value']) || undefined,
    gatewayTips: parseNumber(resource.attributes['gateway_tips']) || undefined,
    gatewayTipsValue: parseNumber(resource.attributes['gateway_tips_value']) || undefined,
    gatewayTotal: parseNumber(resource.attributes['gateway_total']) || undefined,
    gatewayBalance: parseNumber(resource.attributes['gateway_balance']) || undefined,
    gatewayPaidAt: parseDate(resource.attributes['gateway_paid_at']),
    gatewayStatus: parseString(resource.attributes['gateway_status']),
    gatewayResponse: parseString(resource.attributes['gateway_response']),
    status: parseString(resource.attributes['status']),
    paidAt: parseDate(resource.attributes['paid_at']),
  }),
};
