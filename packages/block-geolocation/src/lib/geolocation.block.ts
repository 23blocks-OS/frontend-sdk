import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createLocationsService,
  createAddressesService,
  createAreasService,
  createRegionsService,
  createTravelRoutesService,
  createPremiseBookingsService,
  createPremisesService,
  type LocationsService,
  type AddressesService,
  type AreasService,
  type RegionsService,
  type TravelRoutesService,
  type PremiseBookingsService,
  type PremisesService,
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
  ],
};
