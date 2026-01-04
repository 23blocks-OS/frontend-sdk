import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface RouteLocation extends IdentityCore {
  routeUniqueId: string;
  userUniqueId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateRouteLocationRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp?: string;
  payload?: Record<string, unknown>;
}

export interface RouteTrackerStatus {
  routeUniqueId: string;
  userUniqueId: string;
  isTracking: boolean;
  lastLocation?: RouteLocation;
  totalDistance?: number;
  elapsedTime?: number;
  averageSpeed?: number;
}

export interface ListRouteLocationsParams {
  page?: number;
  perPage?: number;
  startTime?: string;
  endTime?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
