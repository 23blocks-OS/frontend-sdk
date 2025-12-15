import type { Transport } from '@23blocks/contracts';
import type {
  TransactionWebhookRequest,
  TransactionWebhookResponse,
} from '../types/wallet';

export interface WebhooksService {
  /**
   * Process an incoming transaction webhook from an external payment provider.
   * This endpoint is used to record transactions initiated by external systems.
   *
   * @param companyUrlId - The company URL identifier
   * @param walletCode - The wallet code to credit/debit
   * @param data - Transaction webhook payload
   */
  processTransaction(
    companyUrlId: string,
    walletCode: string,
    data: TransactionWebhookRequest
  ): Promise<TransactionWebhookResponse>;
}

export function createWebhooksService(transport: Transport, _config: { appId: string }): WebhooksService {
  return {
    async processTransaction(
      companyUrlId: string,
      walletCode: string,
      data: TransactionWebhookRequest
    ): Promise<TransactionWebhookResponse> {
      const response = await transport.post<unknown>(
        `/companies/${companyUrlId}/wallets/${walletCode}/transactions`,
        {
          transaction: {
            external_id: data.externalId,
            type: data.type,
            amount: data.amount,
            currency: data.currency,
            description: data.description,
            reference_type: data.referenceType,
            reference_unique_id: data.referenceUniqueId,
            payload: data.payload,
          },
        }
      );
      const result = response as TransactionWebhookResponse;
      return {
        success: result.success ?? true,
        transactionUniqueId: result.transactionUniqueId,
        message: result.message,
      };
    },
  };
}
