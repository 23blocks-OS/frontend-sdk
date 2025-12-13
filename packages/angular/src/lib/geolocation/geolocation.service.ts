import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createGeolocationBlock,
  type GeolocationBlock,
  type GeolocationBlockConfig,
  type Location,
  type CreateLocationRequest,
  type UpdateLocationRequest,
  type ListLocationsParams,
  type Address,
  type CreateAddressRequest,
  type UpdateAddressRequest,
  type ListAddressesParams,
  type Area,
  type CreateAreaRequest,
  type UpdateAreaRequest,
  type ListAreasParams,
  type Region,
  type CreateRegionRequest,
  type UpdateRegionRequest,
  type ListRegionsParams,
  type TravelRoute,
  type CreateTravelRouteRequest,
  type UpdateTravelRouteRequest,
  type ListTravelRoutesParams,
  type PremiseBooking,
  type CreatePremiseBookingRequest,
  type UpdatePremiseBookingRequest,
  type ListPremiseBookingsParams,
  type Premise,
  type CreatePremiseRequest,
  type UpdatePremiseRequest,
  type ListPremisesParams,
} from '@23blocks/block-geolocation';
import { TRANSPORT, GEOLOCATION_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Geolocation block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class MapComponent {
 *   constructor(private geolocation: GeolocationService) {}
 *
 *   loadLocations() {
 *     this.geolocation.listLocations().subscribe({
 *       next: (result) => console.log('Locations:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private readonly block: GeolocationBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(GEOLOCATION_CONFIG) config: GeolocationBlockConfig
  ) {
    this.block = createGeolocationBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Locations Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLocations(params?: ListLocationsParams): Observable<PageResult<Location>> {
    return from(this.block.locations.list(params));
  }

  getLocation(uniqueId: string): Observable<Location> {
    return from(this.block.locations.get(uniqueId));
  }

  createLocation(data: CreateLocationRequest): Observable<Location> {
    return from(this.block.locations.create(data));
  }

  updateLocation(uniqueId: string, data: UpdateLocationRequest): Observable<Location> {
    return from(this.block.locations.update(uniqueId, data));
  }

  deleteLocation(uniqueId: string): Observable<void> {
    return from(this.block.locations.delete(uniqueId));
  }

  recoverLocation(uniqueId: string): Observable<Location> {
    return from(this.block.locations.recover(uniqueId));
  }

  searchLocations(query: string, params?: ListLocationsParams): Observable<PageResult<Location>> {
    return from(this.block.locations.search(query, params));
  }

  listDeletedLocations(params?: ListLocationsParams): Observable<PageResult<Location>> {
    return from(this.block.locations.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Addresses Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAddresses(params?: ListAddressesParams): Observable<PageResult<Address>> {
    return from(this.block.addresses.list(params));
  }

  getAddress(uniqueId: string): Observable<Address> {
    return from(this.block.addresses.get(uniqueId));
  }

  createAddress(data: CreateAddressRequest): Observable<Address> {
    return from(this.block.addresses.create(data));
  }

  updateAddress(uniqueId: string, data: UpdateAddressRequest): Observable<Address> {
    return from(this.block.addresses.update(uniqueId, data));
  }

  deleteAddress(uniqueId: string): Observable<void> {
    return from(this.block.addresses.delete(uniqueId));
  }

  recoverAddress(uniqueId: string): Observable<Address> {
    return from(this.block.addresses.recover(uniqueId));
  }

  searchAddresses(query: string, params?: ListAddressesParams): Observable<PageResult<Address>> {
    return from(this.block.addresses.search(query, params));
  }

  listDeletedAddresses(params?: ListAddressesParams): Observable<PageResult<Address>> {
    return from(this.block.addresses.listDeleted(params));
  }

  setDefaultAddress(uniqueId: string): Observable<Address> {
    return from(this.block.addresses.setDefault(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Areas Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAreas(params?: ListAreasParams): Observable<PageResult<Area>> {
    return from(this.block.areas.list(params));
  }

  getArea(uniqueId: string): Observable<Area> {
    return from(this.block.areas.get(uniqueId));
  }

  createArea(data: CreateAreaRequest): Observable<Area> {
    return from(this.block.areas.create(data));
  }

  updateArea(uniqueId: string, data: UpdateAreaRequest): Observable<Area> {
    return from(this.block.areas.update(uniqueId, data));
  }

  deleteArea(uniqueId: string): Observable<void> {
    return from(this.block.areas.delete(uniqueId));
  }

  recoverArea(uniqueId: string): Observable<Area> {
    return from(this.block.areas.recover(uniqueId));
  }

  searchAreas(query: string, params?: ListAreasParams): Observable<PageResult<Area>> {
    return from(this.block.areas.search(query, params));
  }

  listDeletedAreas(params?: ListAreasParams): Observable<PageResult<Area>> {
    return from(this.block.areas.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Regions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listRegions(params?: ListRegionsParams): Observable<PageResult<Region>> {
    return from(this.block.regions.list(params));
  }

  getRegion(uniqueId: string): Observable<Region> {
    return from(this.block.regions.get(uniqueId));
  }

  createRegion(data: CreateRegionRequest): Observable<Region> {
    return from(this.block.regions.create(data));
  }

  updateRegion(uniqueId: string, data: UpdateRegionRequest): Observable<Region> {
    return from(this.block.regions.update(uniqueId, data));
  }

  deleteRegion(uniqueId: string): Observable<void> {
    return from(this.block.regions.delete(uniqueId));
  }

  recoverRegion(uniqueId: string): Observable<Region> {
    return from(this.block.regions.recover(uniqueId));
  }

  searchRegions(query: string, params?: ListRegionsParams): Observable<PageResult<Region>> {
    return from(this.block.regions.search(query, params));
  }

  listDeletedRegions(params?: ListRegionsParams): Observable<PageResult<Region>> {
    return from(this.block.regions.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Travel Routes Service
  // ─────────────────────────────────────────────────────────────────────────────

  listRoutes(params?: ListTravelRoutesParams): Observable<PageResult<TravelRoute>> {
    return from(this.block.routes.list(params));
  }

  getRoute(uniqueId: string): Observable<TravelRoute> {
    return from(this.block.routes.get(uniqueId));
  }

  createRoute(data: CreateTravelRouteRequest): Observable<TravelRoute> {
    return from(this.block.routes.create(data));
  }

  updateRoute(uniqueId: string, data: UpdateTravelRouteRequest): Observable<TravelRoute> {
    return from(this.block.routes.update(uniqueId, data));
  }

  deleteRoute(uniqueId: string): Observable<void> {
    return from(this.block.routes.delete(uniqueId));
  }

  recoverRoute(uniqueId: string): Observable<TravelRoute> {
    return from(this.block.routes.recover(uniqueId));
  }

  searchRoutes(query: string, params?: ListTravelRoutesParams): Observable<PageResult<TravelRoute>> {
    return from(this.block.routes.search(query, params));
  }

  listDeletedRoutes(params?: ListTravelRoutesParams): Observable<PageResult<TravelRoute>> {
    return from(this.block.routes.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Premise Bookings Service
  // ─────────────────────────────────────────────────────────────────────────────

  listBookings(params?: ListPremiseBookingsParams): Observable<PageResult<PremiseBooking>> {
    return from(this.block.bookings.list(params));
  }

  getBooking(uniqueId: string): Observable<PremiseBooking> {
    return from(this.block.bookings.get(uniqueId));
  }

  createBooking(data: CreatePremiseBookingRequest): Observable<PremiseBooking> {
    return from(this.block.bookings.create(data));
  }

  updateBooking(uniqueId: string, data: UpdatePremiseBookingRequest): Observable<PremiseBooking> {
    return from(this.block.bookings.update(uniqueId, data));
  }

  deleteBooking(uniqueId: string): Observable<void> {
    return from(this.block.bookings.delete(uniqueId));
  }

  recoverBooking(uniqueId: string): Observable<PremiseBooking> {
    return from(this.block.bookings.recover(uniqueId));
  }

  searchBookings(query: string, params?: ListPremiseBookingsParams): Observable<PageResult<PremiseBooking>> {
    return from(this.block.bookings.search(query, params));
  }

  listDeletedBookings(params?: ListPremiseBookingsParams): Observable<PageResult<PremiseBooking>> {
    return from(this.block.bookings.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Premises Service
  // ─────────────────────────────────────────────────────────────────────────────

  listPremises(params?: ListPremisesParams): Observable<PageResult<Premise>> {
    return from(this.block.premises.list(params));
  }

  getPremise(uniqueId: string): Observable<Premise> {
    return from(this.block.premises.get(uniqueId));
  }

  createPremise(data: CreatePremiseRequest): Observable<Premise> {
    return from(this.block.premises.create(data));
  }

  updatePremise(uniqueId: string, data: UpdatePremiseRequest): Observable<Premise> {
    return from(this.block.premises.update(uniqueId, data));
  }

  deletePremise(uniqueId: string): Observable<void> {
    return from(this.block.premises.delete(uniqueId));
  }

  recoverPremise(uniqueId: string): Observable<Premise> {
    return from(this.block.premises.recover(uniqueId));
  }

  searchPremises(query: string, params?: ListPremisesParams): Observable<PageResult<Premise>> {
    return from(this.block.premises.search(query, params));
  }

  listDeletedPremises(params?: ListPremisesParams): Observable<PageResult<Premise>> {
    return from(this.block.premises.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): GeolocationBlock {
    return this.block;
  }
}
