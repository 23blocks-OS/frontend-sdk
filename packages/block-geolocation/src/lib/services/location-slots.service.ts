import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  LocationSlot,
  CreateLocationSlotRequest,
  UpdateLocationSlotRequest,
} from '../types/location-slot.js';
import { locationSlotMapper } from '../mappers/location-slot.mapper.js';

export interface LocationSlotsService {
  /**
   * List all time slots for a location
   * @param locationUniqueId - The unique identifier of the location
   * @returns Array of LocationSlot records for the location
   */
  list(locationUniqueId: string): Promise<LocationSlot[]>;

  /**
   * Get a specific time slot
   * @param locationUniqueId - The unique identifier of the location
   * @param slotUniqueId - The unique identifier of the slot
   * @returns The matching LocationSlot record
   */
  get(locationUniqueId: string, slotUniqueId: string): Promise<LocationSlot>;

  /**
   * Create a new time slot for a location
   * @param locationUniqueId - The unique identifier of the location
   * @param data - Slot details including name, times, duration, capacity, and pricing
   * @returns The newly created LocationSlot record
   */
  create(locationUniqueId: string, data: CreateLocationSlotRequest): Promise<LocationSlot>;

  /**
   * Update a time slot
   * @param locationUniqueId - The unique identifier of the location
   * @param slotUniqueId - The unique identifier of the slot to update
   * @param data - Fields to update such as times, capacity, price, or status
   * @returns The updated LocationSlot record
   */
  update(locationUniqueId: string, slotUniqueId: string, data: UpdateLocationSlotRequest): Promise<LocationSlot>;

  /**
   * Delete a time slot
   * @param locationUniqueId - The unique identifier of the location
   * @param slotUniqueId - The unique identifier of the slot to delete
   * @returns Resolves when the slot has been deleted
   */
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
