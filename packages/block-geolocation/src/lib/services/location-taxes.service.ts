import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  LocationTax,
  CreateLocationTaxRequest,
  UpdateLocationTaxRequest,
} from '../types/location-tax.js';
import { locationTaxMapper } from '../mappers/location-tax.mapper.js';

export interface LocationTaxesService {
  /**
   * Create a new tax configuration for a location
   * @param locationUniqueId - The unique identifier of the location
   * @param data - Tax details including name, rate, type, and inclusive/default flags
   * @returns The newly created LocationTax record
   */
  create(locationUniqueId: string, data: CreateLocationTaxRequest): Promise<LocationTax>;

  /**
   * Update a location tax configuration
   * @param locationUniqueId - The unique identifier of the location
   * @param taxUniqueId - The unique identifier of the tax to update
   * @param data - Fields to update such as rate, type, or inclusive flag
   * @returns The updated LocationTax record
   */
  update(locationUniqueId: string, taxUniqueId: string, data: UpdateLocationTaxRequest): Promise<LocationTax>;

  /**
   * Delete a location tax configuration
   * @param locationUniqueId - The unique identifier of the location
   * @param taxUniqueId - The unique identifier of the tax to delete
   * @returns Resolves when the tax configuration has been deleted
   */
  delete(locationUniqueId: string, taxUniqueId: string): Promise<void>;
}

export function createLocationTaxesService(transport: Transport, _config: { apiKey: string }): LocationTaxesService {
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
