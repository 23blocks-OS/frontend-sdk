import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
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
} from './services';

export interface GeolocationBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface GeolocationBlock {
  locations: LocationsService;
  addresses: AddressesService;
  areas: AreasService;
  regions: RegionsService;
  routes: TravelRoutesService;
  bookings: PremiseBookingsService;
  premises: PremisesService;
  premiseEvents: PremiseEventsService;
  routeTracker: RouteTrackerService;
  locationHours: LocationHoursService;
  locationImages: LocationImagesService;
  locationSlots: LocationSlotsService;
  locationTaxes: LocationTaxesService;
  locationGroups: LocationGroupsService;
  identities: GeoIdentitiesService;
  locationIdentities: LocationIdentitiesService;
  geoCountries: GeoCountriesService;
  geoStates: GeoStatesService;
  geoCities: GeoCitiesService;
}

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
