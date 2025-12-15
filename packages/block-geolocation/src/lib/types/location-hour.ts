import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LocationHour extends IdentityCore {
  locationUniqueId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isAllDay: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateLocationHourRequest {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
  isAllDay?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateLocationHourRequest {
  dayOfWeek?: number;
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
  isAllDay?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}
