import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  RouteLocation,
  CreateRouteLocationRequest,
  RouteTrackerStatus,
  ListRouteLocationsParams,
} from '../types/route-tracker.js';
import { routeLocationMapper } from '../mappers/route-tracker.mapper.js';

export interface RouteTrackerService {
  /**
   * Record a location point for a route
   * @param userUniqueId - The unique identifier of the user
   * @param routeUniqueId - The unique identifier of the route
   * @param data - GPS data including coordinates, accuracy, altitude, speed, and heading
   * @returns The newly created RouteLocation point record
   */
  recordLocation(userUniqueId: string, routeUniqueId: string, data: CreateRouteLocationRequest): Promise<RouteLocation>;

  /**
   * Get route tracking status
   * @param userUniqueId - The unique identifier of the user
   * @param routeUniqueId - The unique identifier of the route
   * @returns Tracking status including active flag, last location, distance, elapsed time, and speed
   */
  getStatus(userUniqueId: string, routeUniqueId: string): Promise<RouteTrackerStatus>;

  /**
   * List all recorded locations for a route
   * @param userUniqueId - The unique identifier of the user
   * @param routeUniqueId - The unique identifier of the route
   * @param params - Optional filtering by time range and pagination
   * @returns Paginated result containing RouteLocation items and metadata
   */
  listLocations(userUniqueId: string, routeUniqueId: string, params?: ListRouteLocationsParams): Promise<PageResult<RouteLocation>>;

  /**
   * Start tracking for a route
   * @param userUniqueId - The unique identifier of the user
   * @param routeUniqueId - The unique identifier of the route
   * @returns Tracking status with isTracking set to true
   */
  startTracking(userUniqueId: string, routeUniqueId: string): Promise<RouteTrackerStatus>;

  /**
   * Stop tracking for a route
   * @param userUniqueId - The unique identifier of the user
   * @param routeUniqueId - The unique identifier of the route
   * @returns Final tracking status with isTracking set to false and cumulative metrics
   */
  stopTracking(userUniqueId: string, routeUniqueId: string): Promise<RouteTrackerStatus>;
}

export function createRouteTrackerService(transport: Transport, _config: { appId: string }): RouteTrackerService {
  return {
    async recordLocation(userUniqueId: string, routeUniqueId: string, data: CreateRouteLocationRequest): Promise<RouteLocation> {
      const response = await transport.post<unknown>(
        `/users/${userUniqueId}/routes/${routeUniqueId}/tracker/location`,
        {
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            altitude: data.altitude,
            speed: data.speed,
            heading: data.heading,
            timestamp: data.timestamp,
            payload: data.payload,
          },
        }
      );
      return decodeOne(response, routeLocationMapper);
    },

    async getStatus(userUniqueId: string, routeUniqueId: string): Promise<RouteTrackerStatus> {
      const response = await transport.get<unknown>(
        `/users/${userUniqueId}/routes/${routeUniqueId}/tracker/status`
      );
      const data = response as Record<string, unknown>;
      return {
        routeUniqueId: (data.route_unique_id ?? data.routeUniqueId ?? routeUniqueId) as string,
        userUniqueId: (data.user_unique_id ?? data.userUniqueId ?? userUniqueId) as string,
        isTracking: (data.is_tracking ?? data.isTracking ?? false) as boolean,
        lastLocation: data.last_location ? decodeOne({ data: data.last_location }, routeLocationMapper) : undefined,
        totalDistance: data.total_distance as number | undefined,
        elapsedTime: data.elapsed_time as number | undefined,
        averageSpeed: data.average_speed as number | undefined,
      };
    },

    async listLocations(userUniqueId: string, routeUniqueId: string, params?: ListRouteLocationsParams): Promise<PageResult<RouteLocation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.startTime) queryParams['start_time'] = params.startTime;
      if (params?.endTime) queryParams['end_time'] = params.endTime;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(
        `/users/${userUniqueId}/routes/${routeUniqueId}/tracker/locations`,
        { params: queryParams }
      );
      return decodePageResult(response, routeLocationMapper);
    },

    async startTracking(userUniqueId: string, routeUniqueId: string): Promise<RouteTrackerStatus> {
      const response = await transport.post<unknown>(
        `/users/${userUniqueId}/routes/${routeUniqueId}/tracker/start`,
        {}
      );
      const data = response as Record<string, unknown>;
      return {
        routeUniqueId: (data.route_unique_id ?? data.routeUniqueId ?? routeUniqueId) as string,
        userUniqueId: (data.user_unique_id ?? data.userUniqueId ?? userUniqueId) as string,
        isTracking: true,
        totalDistance: data.total_distance as number | undefined,
        elapsedTime: data.elapsed_time as number | undefined,
        averageSpeed: data.average_speed as number | undefined,
      };
    },

    async stopTracking(userUniqueId: string, routeUniqueId: string): Promise<RouteTrackerStatus> {
      const response = await transport.post<unknown>(
        `/users/${userUniqueId}/routes/${routeUniqueId}/tracker/stop`,
        {}
      );
      const data = response as Record<string, unknown>;
      return {
        routeUniqueId: (data.route_unique_id ?? data.routeUniqueId ?? routeUniqueId) as string,
        userUniqueId: (data.user_unique_id ?? data.userUniqueId ?? userUniqueId) as string,
        isTracking: false,
        totalDistance: data.total_distance as number | undefined,
        elapsedTime: data.elapsed_time as number | undefined,
        averageSpeed: data.average_speed as number | undefined,
      };
    },
  };
}
