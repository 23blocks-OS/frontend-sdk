import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  LocationHour,
  CreateLocationHourRequest,
  UpdateLocationHourRequest,
} from '../types/location-hour';
import { locationHourMapper } from '../mappers/location-hour.mapper';

export interface LocationHoursService {
  list(locationUniqueId: string): Promise<LocationHour[]>;
  get(locationUniqueId: string, hourUniqueId: string): Promise<LocationHour>;
  create(locationUniqueId: string, data: CreateLocationHourRequest): Promise<LocationHour>;
  update(locationUniqueId: string, hourUniqueId: string, data: UpdateLocationHourRequest): Promise<LocationHour>;
  delete(locationUniqueId: string, hourUniqueId: string): Promise<void>;
}

export function createLocationHoursService(transport: Transport, _config: { appId: string }): LocationHoursService {
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
