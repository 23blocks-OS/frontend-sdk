import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  LocationSlot,
  CreateLocationSlotRequest,
  UpdateLocationSlotRequest,
} from '../types/location-slot';
import { locationSlotMapper } from '../mappers/location-slot.mapper';

export interface LocationSlotsService {
  list(locationUniqueId: string): Promise<LocationSlot[]>;
  get(locationUniqueId: string, slotUniqueId: string): Promise<LocationSlot>;
  create(locationUniqueId: string, data: CreateLocationSlotRequest): Promise<LocationSlot>;
  update(locationUniqueId: string, slotUniqueId: string, data: UpdateLocationSlotRequest): Promise<LocationSlot>;
  delete(locationUniqueId: string, slotUniqueId: string): Promise<void>;
}

export function createLocationSlotsService(transport: Transport, _config: { appId: string }): LocationSlotsService {
  return {
    async list(locationUniqueId: string): Promise<LocationSlot[]> {
      const response = await transport.get<unknown>(`/locations/${locationUniqueId}/slots`);
      return decodeMany(response, locationSlotMapper);
    },

    async get(locationUniqueId: string, slotUniqueId: string): Promise<LocationSlot> {
      const response = await transport.get<unknown>(`/locations/${locationUniqueId}/slots/${slotUniqueId}`);
      return decodeOne(response, locationSlotMapper);
    },

    async create(locationUniqueId: string, data: CreateLocationSlotRequest): Promise<LocationSlot> {
      const response = await transport.post<unknown>(`/locations/${locationUniqueId}/slots`, {
        location_slot: {
          name: data.name,
          start_time: data.startTime,
          end_time: data.endTime,
          duration: data.duration,
          capacity: data.capacity,
          price: data.price,
          day_of_week: data.dayOfWeek,
          is_recurring: data.isRecurring,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationSlotMapper);
    },

    async update(locationUniqueId: string, slotUniqueId: string, data: UpdateLocationSlotRequest): Promise<LocationSlot> {
      const response = await transport.put<unknown>(`/locations/${locationUniqueId}/slots/${slotUniqueId}`, {
        location_slot: {
          name: data.name,
          start_time: data.startTime,
          end_time: data.endTime,
          duration: data.duration,
          capacity: data.capacity,
          price: data.price,
          day_of_week: data.dayOfWeek,
          is_recurring: data.isRecurring,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationSlotMapper);
    },

    async delete(locationUniqueId: string, slotUniqueId: string): Promise<void> {
      await transport.delete(`/locations/${locationUniqueId}/slots/${slotUniqueId}`);
    },
  };
}
