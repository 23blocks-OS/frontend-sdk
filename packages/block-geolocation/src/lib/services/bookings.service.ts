import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PremiseBooking,
  CreatePremiseBookingRequest,
  UpdatePremiseBookingRequest,
  ListPremiseBookingsParams,
} from '../types/booking.js';
import { premiseBookingMapper } from '../mappers/booking.mapper.js';

export interface PremiseBookingsService {
  /**
   * List all premise bookings
   * @param params - Optional filtering by premise, user, date range, status, and pagination
   * @returns Paginated result containing PremiseBooking items and metadata
   */
  list(params?: ListPremiseBookingsParams): Promise<PageResult<PremiseBooking>>;

  /**
   * Get a specific premise booking
   * @param uniqueId - The unique identifier of the booking
   * @returns The matching PremiseBooking record
   */
  get(uniqueId: string): Promise<PremiseBooking>;

  /**
   * Create a new premise booking
   * @param data - Booking details including premise, user, and check-in/out times
   * @returns The newly created PremiseBooking record
   */
  create(data: CreatePremiseBookingRequest): Promise<PremiseBooking>;

  /**
   * Update an existing premise booking
   * @param uniqueId - The unique identifier of the booking to update
   * @param data - Fields to update such as check-in/out times or status
   * @returns The updated PremiseBooking record
   */
  update(uniqueId: string, data: UpdatePremiseBookingRequest): Promise<PremiseBooking>;

  /**
   * Delete a premise booking (soft delete)
   * @param uniqueId - The unique identifier of the booking to delete
   * @returns Resolves when the booking has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted booking
   * @param uniqueId - The unique identifier of the deleted booking
   * @returns The recovered PremiseBooking record
   */
  recover(uniqueId: string): Promise<PremiseBooking>;

  /**
   * Record check-in for a booking
   * @param uniqueId - The unique identifier of the booking to check in
   * @returns The updated PremiseBooking record with check-in recorded
   */
  checkIn(uniqueId: string): Promise<PremiseBooking>;

  /**
   * Record check-out for a booking
   * @param uniqueId - The unique identifier of the booking to check out
   * @returns The updated PremiseBooking record with check-out recorded
   */
  checkOut(uniqueId: string): Promise<PremiseBooking>;
}

export function createPremiseBookingsService(transport: Transport, _config: { appId: string }): PremiseBookingsService {
  return {
    async list(params?: ListPremiseBookingsParams): Promise<PageResult<PremiseBooking>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.premiseUniqueId) queryParams['premise_unique_id'] = params.premiseUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.userType) queryParams['user_type'] = params.userType;
      if (params?.fromDate) queryParams['from_date'] = params.fromDate.toISOString();
      if (params?.toDate) queryParams['to_date'] = params.toDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/premise_bookings', { params: queryParams });
      return decodePageResult(response, premiseBookingMapper);
    },

    async get(uniqueId: string): Promise<PremiseBooking> {
      const response = await transport.get<unknown>(`/premise_bookings/${uniqueId}`);
      return decodeOne(response, premiseBookingMapper);
    },

    async create(data: CreatePremiseBookingRequest): Promise<PremiseBooking> {
      const response = await transport.post<unknown>('/premise_bookings', {
        premisebooking: {
            premise_unique_id: data.premiseUniqueId,
            code: data.code,
            user_type: data.userType,
            user_unique_id: data.userUniqueId,
            check_in_time: data.checkInTime?.toISOString(),
            check_out_time: data.checkOutTime?.toISOString(),
            payload: data.payload,
          },
      });
      return decodeOne(response, premiseBookingMapper);
    },

    async update(uniqueId: string, data: UpdatePremiseBookingRequest): Promise<PremiseBooking> {
      const response = await transport.put<unknown>(`/premise_bookings/${uniqueId}`, {
        premisebooking: {
            check_in_time: data.checkInTime?.toISOString(),
            check_out_time: data.checkOutTime?.toISOString(),
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, premiseBookingMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/premise_bookings/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<PremiseBooking> {
      const response = await transport.put<unknown>(`/premise_bookings/${uniqueId}/recover`, {});
      return decodeOne(response, premiseBookingMapper);
    },

    async checkIn(uniqueId: string): Promise<PremiseBooking> {
      const response = await transport.put<unknown>(`/premise_bookings/${uniqueId}/check-in`, {});
      return decodeOne(response, premiseBookingMapper);
    },

    async checkOut(uniqueId: string): Promise<PremiseBooking> {
      const response = await transport.put<unknown>(`/premise_bookings/${uniqueId}/check-out`, {});
      return decodeOne(response, premiseBookingMapper);
    },
  };
}
