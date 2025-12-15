import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LocationSlot extends IdentityCore {
  locationUniqueId: string;
  name?: string;
  startTime: string;
  endTime: string;
  duration?: number;
  capacity?: number;
  availableCapacity?: number;
  price?: number;
  dayOfWeek?: number;
  isRecurring: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateLocationSlotRequest {
  name?: string;
  startTime: string;
  endTime: string;
  duration?: number;
  capacity?: number;
  price?: number;
  dayOfWeek?: number;
  isRecurring?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateLocationSlotRequest {
  name?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  capacity?: number;
  price?: number;
  dayOfWeek?: number;
  isRecurring?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}
