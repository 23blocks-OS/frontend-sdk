import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface PremiseBooking extends IdentityCore {
  code?: string;
  payload?: Record<string, unknown>;
  qcode?: string;
  premiseUniqueId: string;
  premiseCode?: string;
  premiseName?: string;
  userType?: string;
  userUniqueId?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: EntityStatus;
  enabled: boolean;
}

// Request types
export interface CreatePremiseBookingRequest {
  premiseUniqueId: string;
  code?: string;
  userType?: string;
  userUniqueId?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  payload?: Record<string, unknown>;
}

export interface UpdatePremiseBookingRequest {
  checkInTime?: Date;
  checkOutTime?: Date;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListPremiseBookingsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  premiseUniqueId?: string;
  userUniqueId?: string;
  userType?: string;
  fromDate?: Date;
  toDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
