import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { Purchase, CreatePurchaseRequest } from '../types/purchase.js';
import { purchaseMapper } from '../mappers/purchase.mapper.js';

export interface PurchasesService {
  /**
   * Create a gateway-agnostic purchase.
   *
   * Creates an Order + OrderDetail + Payment + Subscription in a single call.
   * Use this for free plan activations and server-confirmed purchases instead
   * of the multi-step register + create-subscription + checkout flow.
   *
   * @returns The Purchase record with order, subscription, and payment details.
   */
  create(data: CreatePurchaseRequest): Promise<Purchase>;
}

export function createPurchasesService(transport: Transport, _config: { appId: string }): PurchasesService {
  return {
    async create(data: CreatePurchaseRequest): Promise<Purchase> {
      const response = await transport.post<unknown>('/purchases', {
        purchase: {
          subscription_model_code: data.subscriptionModelCode,
          identity_type: data.identityType,
          user_unique_id: 'userUniqueId' in data ? data.userUniqueId : undefined,
          company_unique_id: 'companyUniqueId' in data ? data.companyUniqueId : undefined,
          entity_unique_id: 'entityUniqueId' in data ? data.entityUniqueId : undefined,
          gateway: data.gateway,
          gateway_transaction_id: data.gatewayTransactionId,
          promo_code: data.promoCode,
          price_unique_id: data.priceUniqueId,
          metadata: data.metadata,
        },
      });
      return decodeOne(response, purchaseMapper);
    },
  };
}
