// Block factory and metadata
export { createGeolocationBlock, geolocationBlockMetadata } from './lib/geolocation.block';
export type { GeolocationBlock, GeolocationBlockConfig } from './lib/geolocation.block';

// Types
export type {
  // Location types
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  ListLocationsParams,
  // Address types
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  ListAddressesParams,
  // Area types
  Area,
  CreateAreaRequest,
  UpdateAreaRequest,
  ListAreasParams,
  // Region types
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
  ListRegionsParams,
  // Route types
  TravelRoute,
  CreateTravelRouteRequest,
  UpdateTravelRouteRequest,
  ListTravelRoutesParams,
  // Booking types
  PremiseBooking,
  CreatePremiseBookingRequest,
  UpdatePremiseBookingRequest,
  ListPremiseBookingsParams,
  // Premise types
  Premise,
  CreatePremiseRequest,
  UpdatePremiseRequest,
  ListPremisesParams,
} from './lib/types';

// Services
export type {
  LocationsService,
  AddressesService,
  AreasService,
  RegionsService,
  TravelRoutesService,
  PremiseBookingsService,
  PremisesService,
} from './lib/services';

export {
  createLocationsService,
  createAddressesService,
  createAreasService,
  createRegionsService,
  createTravelRoutesService,
  createPremiseBookingsService,
  createPremisesService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  locationMapper,
  addressMapper,
  areaMapper,
  regionMapper,
  travelRouteMapper,
  premiseBookingMapper,
  premiseMapper,
} from './lib/mappers';
