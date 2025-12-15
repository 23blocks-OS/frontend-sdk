export interface UserAvailability {
  userUniqueId: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'dnd';
  lastSeenAt?: Date;
  customStatus?: string;
  payload?: Record<string, unknown>;
}

export interface SetAvailabilityRequest {
  status?: 'online' | 'away' | 'busy' | 'dnd';
  customStatus?: string;
  payload?: Record<string, unknown>;
}
