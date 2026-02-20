import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  LocationHour,
  CreateLocationHourRequest,
  UpdateLocationHourRequest,
} from '../types/location-hour.js';
import { locationHourMapper } from '../mappers/location-hour.mapper.js';

export interface LocationHoursService {
  /**
   * List all operating hours for a location
   * @param locationUniqueId - The unique identifier of the location
   * @returns Array of LocationHour records for each configured day/period
   */
  list(locationUniqueId: string): Promise<LocationHour[]>;

  /**
   * Get a specific operating hours entry
   * @param locationUniqueId - The unique identifier of the location
   * @param hourUniqueId - The unique identifier of the hours entry
   * @returns The matching LocationHour record
   */
  get(locationUniqueId: string, hourUniqueId: string): Promise<LocationHour>;

  /**
   * Create a new operating hours entry for a location
   * @param locationUniqueId - The unique identifier of the location
   * @param data - Hours details including day of week, open/close times, and closed/all-day flags
   * @returns The newly created LocationHour record
   */
  create(locationUniqueId: string, data: CreateLocationHourRequest): Promise<LocationHour>;

  /**
   * Update an operating hours entry
   * @param locationUniqueId - The unique identifier of the location
   * @param hourUniqueId - The unique identifier of the hours entry to update
   * @param data - Fields to update such as times, closed flag, or status
   * @returns The updated LocationHour record
   */
  update(locationUniqueId: string, hourUniqueId: string, data: UpdateLocationHourRequest): Promise<LocationHour>;

  /**
   * Delete an operating hours entry
   * @param locationUniqueId - The unique identifier of the location
   * @param hourUniqueId - The unique identifier of the hours entry to delete
   * @returns Resolves when the hours entry has been deleted
   */
  delete(locationUniqueId: string, hourUniqueId: string): Promise<void>;
}

export function createLocationHoursService(transport: Transport, _config: { apiKey: string }): LocationHoursService {
  return {
    async list(locationUniqueId: string): Promise<LocationHour[]> {
      const response = await transport.get<unknown>(`/locations/${locationUniqueId}/hours/`);
      return decodeMany(response, locationHourMapper);
    },

    async get(locationUniqueId: string, hourUniqueId: string): Promise<LocationHour> {
      const response = await transport.get<unknown>(`/locations/${locationUniqueId}/hours/${hourUniqueId}`);
      return decodeOne(response, locationHourMapper);
    },

    async create(locationUniqueId: string, data: CreateLocationHourRequest): Promise<LocationHour> {
      const response = await transport.post<unknown>(`/locations/${locationUniqueId}/hours/`, {
        location_hour: {
          day_of_week: data.dayOfWeek,
          open_time: data.openTime,
          close_time: data.closeTime,
          is_closed: data.isClosed,
          is_all_day: data.isAllDay,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationHourMapper);
    },

    async update(locationUniqueId: string, hourUniqueId: string, data: UpdateLocationHourRequest): Promise<LocationHour> {
      const response = await transport.put<unknown>(`/locations/${locationUniqueId}/hours/${hourUniqueId}`, {
        location_hour: {
          day_of_week: data.dayOfWeek,
          open_time: data.openTime,
          close_time: data.closeTime,
          is_closed: data.isClosed,
          is_all_day: data.isAllDay,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationHourMapper);
    },

    async delete(locationUniqueId: string, hourUniqueId: string): Promise<void> {
      await transport.delete(`/locations/${locationUniqueId}/hours/${hourUniqueId}`);
    },
  };
}
