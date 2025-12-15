import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  OfferCode,
  CreateOfferCodeRequest,
  SendOfferCodeRequest,
  RedeemOfferCodeRequest,
} from '../types/offer-code';
import { offerCodeMapper } from '../mappers/offer-code.mapper';

export interface OfferCodesService {
  get(code: string): Promise<OfferCode>;
  create(data: CreateOfferCodeRequest): Promise<OfferCode>;
  send(data: SendOfferCodeRequest): Promise<OfferCode>;
  redeem(data: RedeemOfferCodeRequest): Promise<OfferCode>;
}

export function createOfferCodesService(transport: Transport, _config: { appId: string }): OfferCodesService {
  return {
    async get(code: string): Promise<OfferCode> {
      const response = await transport.get<unknown>(`/offer_codes/${code}`);
      return decodeOne(response, offerCodeMapper);
    },

    async create(data: CreateOfferCodeRequest): Promise<OfferCode> {
      const response = await transport.post<unknown>('/offer_codes/', {
        offer_code: {
          code: data.code,
          name: data.name,
          description: data.description,
          offer_type: data.offerType,
          value: data.value,
          expires_at: data.expiresAt?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, offerCodeMapper);
    },

    async send(data: SendOfferCodeRequest): Promise<OfferCode> {
      const response = await transport.post<unknown>('/offer_codes/send', {
        offer_code: {
          code: data.code,
          email: data.email,
          name: data.name,
          template_id: data.templateId,
          payload: data.payload,
        },
      });
      return decodeOne(response, offerCodeMapper);
    },

    async redeem(data: RedeemOfferCodeRequest): Promise<OfferCode> {
      const response = await transport.post<unknown>('/codes/', {
        code: data.code,
        user_unique_id: data.userUniqueId,
      });
      return decodeOne(response, offerCodeMapper);
    },
  };
}
