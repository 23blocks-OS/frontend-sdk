import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
  createLocationsService,
  createAddressesService,
  createAreasService,
  createRegionsService,
  createTravelRoutesService,
  createPremiseBookingsService,
  createPremisesService,
  createPremiseEventsService,
  createRouteTrackerService,
  createLocationHoursService,
  createLocationImagesService,
  createLocationSlotsService,
  createLocationTaxesService,
  createLocationGroupsService,
  createGeoIdentitiesService,
  createLocationIdentitiesService,
  createGeoCountriesService,
  createGeoStatesService,
  createGeoCitiesService,
  type LocationsService,
  type AddressesService,
  type AreasService,
  type RegionsService,
  type TravelRoutesService,
  type PremiseBookingsService,
  type PremisesService,
  type PremiseEventsService,
  type RouteTrackerService,
  type LocationHoursService,
  type LocationImagesService,
  type LocationSlotsService,
  type LocationTaxesService,
  type LocationGroupsService,
  type GeoIdentitiesService,
  type LocationIdentitiesService,
  type GeoCountriesService,
  type GeoStatesService,
  type GeoCitiesService,
} from './services/index.js';

/**
 * Configuration for the Geolocation block.
 */
export interface GeolocationBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Geolocation and premises management block interface.
 */
export interface GeolocationBlock {
  /** Location CRUD operations */
  locations: LocationsService;
  /** Address management */
  addresses: AddressesService;
  /** Geographic area management */
  areas: AreasService;
  /** Geographic region management */
  regions: RegionsService;
  /** Travel route management */
  routes: TravelRoutesService;
  /** Premise booking management */
  bookings: PremiseBookingsService;
  /** Premise management */
  premises: PremisesService;
  /** Premise event tracking */
  premiseEvents: PremiseEventsService;
  /** Route location tracker */
  routeTracker: RouteTrackerService;
  /** Location operating hours management */
  locationHours: LocationHoursService;
  /** Location image management */
  locationImages: LocationImagesService;
  /** Location time-slot management */
  locationSlots: LocationSlotsService;
  /** Location tax configuration */
  locationTaxes: LocationTaxesService;
  /** Location group management */
  locationGroups: LocationGroupsService;
  /** Geo identity management */
  identities: GeoIdentitiesService;
  /** Location-identity association management */
  locationIdentities: LocationIdentitiesService;
  /** Country lookup */
  geoCountries: GeoCountriesService;
  /** State/province lookup */
  geoStates: GeoStatesService;
  /** City lookup */
  geoCities: GeoCitiesService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Geolocation block.
 *
 * @example
 * ```typescript
 * const block = createGeolocationBlock(transport, { appId: 'xxx' });
 * const locations = await block.locations.list({ page: 1 });
 * ```
 */
export function createGeolocationBlock(
  transport: Transport,
  config: GeolocationBlockConfig
): GeolocationBlock {
  return {
    locations: createLocationsService(transport, config),
    addresses: createAddressesService(transport, config),
    areas: createAreasService(transport, config),
    regions: createRegionsService(transport, config),
    routes: createTravelRoutesService(transport, config),
    bookings: createPremiseBookingsService(transport, config),
    premises: createPremisesService(transport, config),
    premiseEvents: createPremiseEventsService(transport, config),
    routeTracker: createRouteTrackerService(transport, config),
    locationHours: createLocationHoursService(transport, config),
    locationImages: createLocationImagesService(transport, config),
    locationSlots: createLocationSlotsService(transport, config),
    locationTaxes: createLocationTaxesService(transport, config),
    locationGroups: createLocationGroupsService(transport, config),
    identities: createGeoIdentitiesService(transport, config),
    locationIdentities: createLocationIdentitiesService(transport, config),
    geoCountries: createGeoCountriesService(transport, config),
    geoStates: createGeoStatesService(transport, config),
    geoCities: createGeoCitiesService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
  };
}

export const geolocationBlockMetadata: BlockMetadata = {
  name: 'geolocation',
  version: '0.1.0',
  description: 'Geolocation management - locations, addresses, areas, regions, routes, premises, and bookings',
  resourceTypes: [
    'Location',
    'Address',
    'Area',
    'Region',
    'TravelRoute',
    'PremiseBooking',
    'Premise',
    'PremiseEvent',
    'RouteLocation',
    'LocationHour',
    'LocationImage',
    'LocationSlot',
    'LocationTax',
    'LocationGroup',
    'GeoIdentity',
    'LocationIdentity',
    'GeoCountry',
    'GeoState',
    'GeoCity',
  ],
};
