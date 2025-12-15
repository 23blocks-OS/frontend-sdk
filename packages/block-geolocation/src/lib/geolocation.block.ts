import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createLocationsService,
  createAddressesService,
  createAreasService,
  createRegionsService,
  createTravelRoutesService,
  createPremiseBookingsService,
  createPremisesService,
  createLocationHoursService,
  createLocationImagesService,
  createLocationSlotsService,
  createLocationTaxesService,
  createLocationGroupsService,
  createGeoIdentitiesService,
  type LocationsService,
  type AddressesService,
  type AreasService,
  type RegionsService,
  type TravelRoutesService,
  type PremiseBookingsService,
  type PremisesService,
  type LocationHoursService,
  type LocationImagesService,
  type LocationSlotsService,
  type LocationTaxesService,
  type LocationGroupsService,
  type GeoIdentitiesService,
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
  locationHours: LocationHoursService;
  locationImages: LocationImagesService;
  locationSlots: LocationSlotsService;
  locationTaxes: LocationTaxesService;
  locationGroups: LocationGroupsService;
  identities: GeoIdentitiesService;
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
    locationHours: createLocationHoursService(transport, config),
    locationImages: createLocationImagesService(transport, config),
    locationSlots: createLocationSlotsService(transport, config),
    locationTaxes: createLocationTaxesService(transport, config),
    locationGroups: createLocationGroupsService(transport, config),
    identities: createGeoIdentitiesService(transport, config),
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
    'LocationHour',
    'LocationImage',
    'LocationSlot',
    'LocationTax',
    'LocationGroup',
    'GeoIdentity',
  ],
};
