import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { AssetAlert, CreateAssetAlertRequest } from '../types/alert';
import { assetAlertMapper } from '../mappers/alert.mapper';

export interface AlertsService {
  get(uniqueId: string): Promise<AssetAlert>;
  create(data: CreateAssetAlertRequest): Promise<AssetAlert>;
  delete(uniqueId: string): Promise<void>;
}

export function createAlertsService(transport: Transport, _config: { appId: string }): AlertsService {
  return {
    async get(uniqueId: string): Promise<AssetAlert> {
      const response = await transport.get<unknown>(`/alerts/${uniqueId}`);
      return decodeOne(response, assetAlertMapper);
    },

    async create(data: CreateAssetAlertRequest): Promise<AssetAlert> {
      const response = await transport.post<unknown>('/alerts/eval', {
        alert: {
          asset_unique_id: data.assetUniqueId,
          alert_type: data.alertType,
          message: data.message,
          severity: data.severity,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetAlertMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/alerts/${uniqueId}`);
    },
  };
}
