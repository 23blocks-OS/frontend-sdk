import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  LocationTax,
  CreateLocationTaxRequest,
  UpdateLocationTaxRequest,
} from '../types/location-tax';
import { locationTaxMapper } from '../mappers/location-tax.mapper';

export interface LocationTaxesService {
  create(locationUniqueId: string, data: CreateLocationTaxRequest): Promise<LocationTax>;
  update(locationUniqueId: string, taxUniqueId: string, data: UpdateLocationTaxRequest): Promise<LocationTax>;
  delete(locationUniqueId: string, taxUniqueId: string): Promise<void>;
}

export function createLocationTaxesService(transport: Transport, _config: { appId: string }): LocationTaxesService {
  return {
    async create(locationUniqueId: string, data: CreateLocationTaxRequest): Promise<LocationTax> {
      const response = await transport.post<unknown>(`/locations/${locationUniqueId}/taxes`, {
        location_tax: {
          name: data.name,
          rate: data.rate,
          tax_type: data.taxType,
          is_inclusive: data.isInclusive,
          is_default: data.isDefault,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationTaxMapper);
    },

    async update(locationUniqueId: string, taxUniqueId: string, data: UpdateLocationTaxRequest): Promise<LocationTax> {
      const response = await transport.put<unknown>(`/locations/${locationUniqueId}/taxes/${taxUniqueId}`, {
        location_tax: {
          name: data.name,
          rate: data.rate,
          tax_type: data.taxType,
          is_inclusive: data.isInclusive,
          is_default: data.isDefault,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationTaxMapper);
    },

    async delete(locationUniqueId: string, taxUniqueId: string): Promise<void> {
      await transport.delete(`/locations/${locationUniqueId}/taxes/${taxUniqueId}`);
    },
  };
}
