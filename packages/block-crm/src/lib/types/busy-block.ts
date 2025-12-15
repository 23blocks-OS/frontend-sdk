import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface BusyBlock extends IdentityCore {
  userUniqueId: string;
  title?: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  allDay?: boolean;
  recurring?: boolean;
  recurrenceRule?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateBusyBlockRequest {
  title?: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  allDay?: boolean;
  recurring?: boolean;
  recurrenceRule?: string;
  payload?: Record<string, unknown>;
}

export interface ListBusyBlocksParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  startTime?: Date;
  endTime?: Date;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
