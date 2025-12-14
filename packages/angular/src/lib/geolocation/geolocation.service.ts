import { Injectable, Inject, Optional } from '@angular/core';
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
import { TRANSPORT, GEOLOCATION_TRANSPORT, GEOLOCATION_CONFIG } from '../tokens.js';

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
  private readonly block: GeolocationBlock | null;

  constructor(
    @Optional() @Inject(GEOLOCATION_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(GEOLOCATION_CONFIG) config: GeolocationBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createGeolocationBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): GeolocationBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] GeolocationService is not configured. ' +
        "Add 'urls.geolocation' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Locations Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLocations(params?: ListLocationsParams): Observable<PageResult<Location>> {
    return from(this.ensureConfigured().locations.list(params));
  }

  getLocation(uniqueId: string): Observable<Location> {
    return from(this.ensureConfigured().locations.get(uniqueId));
  }

  createLocation(data: CreateLocationRequest): Observable<Location> {
    return from(this.ensureConfigured().locations.create(data));
  }

  updateLocation(uniqueId: string, data: UpdateLocationRequest): Observable<Location> {
    return from(this.ensureConfigured().locations.update(uniqueId, data));
  }

  deleteLocation(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().locations.delete(uniqueId));
  }

  recoverLocation(uniqueId: string): Observable<Location> {
    return from(this.ensureConfigured().locations.recover(uniqueId));
  }

  searchLocations(query: string, params?: ListLocationsParams): Observable<PageResult<Location>> {
    return from(this.ensureConfigured().locations.search(query, params));
  }

  listDeletedLocations(params?: ListLocationsParams): Observable<PageResult<Location>> {
    return from(this.ensureConfigured().locations.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Addresses Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAddresses(params?: ListAddressesParams): Observable<PageResult<Address>> {
    return from(this.ensureConfigured().addresses.list(params));
  }

  getAddress(uniqueId: string): Observable<Address> {
    return from(this.ensureConfigured().addresses.get(uniqueId));
  }

  createAddress(data: CreateAddressRequest): Observable<Address> {
    return from(this.ensureConfigured().addresses.create(data));
  }

  updateAddress(uniqueId: string, data: UpdateAddressRequest): Observable<Address> {
    return from(this.ensureConfigured().addresses.update(uniqueId, data));
  }

  deleteAddress(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().addresses.delete(uniqueId));
  }

  recoverAddress(uniqueId: string): Observable<Address> {
    return from(this.ensureConfigured().addresses.recover(uniqueId));
  }

  searchAddresses(query: string, params?: ListAddressesParams): Observable<PageResult<Address>> {
    return from(this.ensureConfigured().addresses.search(query, params));
  }

  listDeletedAddresses(params?: ListAddressesParams): Observable<PageResult<Address>> {
    return from(this.ensureConfigured().addresses.listDeleted(params));
  }

  setDefaultAddress(uniqueId: string): Observable<Address> {
    return from(this.ensureConfigured().addresses.setDefault(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Areas Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAreas(params?: ListAreasParams): Observable<PageResult<Area>> {
    return from(this.ensureConfigured().areas.list(params));
  }

  getArea(uniqueId: string): Observable<Area> {
    return from(this.ensureConfigured().areas.get(uniqueId));
  }

  createArea(data: CreateAreaRequest): Observable<Area> {
    return from(this.ensureConfigured().areas.create(data));
  }

  updateArea(uniqueId: string, data: UpdateAreaRequest): Observable<Area> {
    return from(this.ensureConfigured().areas.update(uniqueId, data));
  }

  deleteArea(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().areas.delete(uniqueId));
  }

  recoverArea(uniqueId: string): Observable<Area> {
    return from(this.ensureConfigured().areas.recover(uniqueId));
  }

  searchAreas(query: string, params?: ListAreasParams): Observable<PageResult<Area>> {
    return from(this.ensureConfigured().areas.search(query, params));
  }

  listDeletedAreas(params?: ListAreasParams): Observable<PageResult<Area>> {
    return from(this.ensureConfigured().areas.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Regions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listRegions(params?: ListRegionsParams): Observable<PageResult<Region>> {
    return from(this.ensureConfigured().regions.list(params));
  }

  getRegion(uniqueId: string): Observable<Region> {
    return from(this.ensureConfigured().regions.get(uniqueId));
  }

  createRegion(data: CreateRegionRequest): Observable<Region> {
    return from(this.ensureConfigured().regions.create(data));
  }

  updateRegion(uniqueId: string, data: UpdateRegionRequest): Observable<Region> {
    return from(this.ensureConfigured().regions.update(uniqueId, data));
  }

  deleteRegion(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().regions.delete(uniqueId));
  }

  recoverRegion(uniqueId: string): Observable<Region> {
    return from(this.ensureConfigured().regions.recover(uniqueId));
  }

  searchRegions(query: string, params?: ListRegionsParams): Observable<PageResult<Region>> {
    return from(this.ensureConfigured().regions.search(query, params));
  }

  listDeletedRegions(params?: ListRegionsParams): Observable<PageResult<Region>> {
    return from(this.ensureConfigured().regions.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Travel Routes Service
  // ─────────────────────────────────────────────────────────────────────────────

  listRoutes(params?: ListTravelRoutesParams): Observable<PageResult<TravelRoute>> {
    return from(this.ensureConfigured().routes.list(params));
  }

  getRoute(uniqueId: string): Observable<TravelRoute> {
    return from(this.ensureConfigured().routes.get(uniqueId));
  }

  createRoute(data: CreateTravelRouteRequest): Observable<TravelRoute> {
    return from(this.ensureConfigured().routes.create(data));
  }

  updateRoute(uniqueId: string, data: UpdateTravelRouteRequest): Observable<TravelRoute> {
    return from(this.ensureConfigured().routes.update(uniqueId, data));
  }

  deleteRoute(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().routes.delete(uniqueId));
  }

  recoverRoute(uniqueId: string): Observable<TravelRoute> {
    return from(this.ensureConfigured().routes.recover(uniqueId));
  }

  searchRoutes(query: string, params?: ListTravelRoutesParams): Observable<PageResult<TravelRoute>> {
    return from(this.ensureConfigured().routes.search(query, params));
  }

  listDeletedRoutes(params?: ListTravelRoutesParams): Observable<PageResult<TravelRoute>> {
    return from(this.ensureConfigured().routes.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Premise Bookings Service
  // ─────────────────────────────────────────────────────────────────────────────

  listBookings(params?: ListPremiseBookingsParams): Observable<PageResult<PremiseBooking>> {
    return from(this.ensureConfigured().bookings.list(params));
  }

  getBooking(uniqueId: string): Observable<PremiseBooking> {
    return from(this.ensureConfigured().bookings.get(uniqueId));
  }

  createBooking(data: CreatePremiseBookingRequest): Observable<PremiseBooking> {
    return from(this.ensureConfigured().bookings.create(data));
  }

  updateBooking(uniqueId: string, data: UpdatePremiseBookingRequest): Observable<PremiseBooking> {
    return from(this.ensureConfigured().bookings.update(uniqueId, data));
  }

  deleteBooking(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().bookings.delete(uniqueId));
  }

  recoverBooking(uniqueId: string): Observable<PremiseBooking> {
    return from(this.ensureConfigured().bookings.recover(uniqueId));
  }

  searchBookings(query: string, params?: ListPremiseBookingsParams): Observable<PageResult<PremiseBooking>> {
    return from(this.ensureConfigured().bookings.search(query, params));
  }

  listDeletedBookings(params?: ListPremiseBookingsParams): Observable<PageResult<PremiseBooking>> {
    return from(this.ensureConfigured().bookings.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Premises Service
  // ─────────────────────────────────────────────────────────────────────────────

  listPremises(params?: ListPremisesParams): Observable<PageResult<Premise>> {
    return from(this.ensureConfigured().premises.list(params));
  }

  getPremise(uniqueId: string): Observable<Premise> {
    return from(this.ensureConfigured().premises.get(uniqueId));
  }

  createPremise(data: CreatePremiseRequest): Observable<Premise> {
    return from(this.ensureConfigured().premises.create(data));
  }

  updatePremise(uniqueId: string, data: UpdatePremiseRequest): Observable<Premise> {
    return from(this.ensureConfigured().premises.update(uniqueId, data));
  }

  deletePremise(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().premises.delete(uniqueId));
  }

  recoverPremise(uniqueId: string): Observable<Premise> {
    return from(this.ensureConfigured().premises.recover(uniqueId));
  }

  searchPremises(query: string, params?: ListPremisesParams): Observable<PageResult<Premise>> {
    return from(this.ensureConfigured().premises.search(query, params));
  }

  listDeletedPremises(params?: ListPremisesParams): Observable<PageResult<Premise>> {
    return from(this.ensureConfigured().premises.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): GeolocationBlock {
    return this.ensureConfigured();
  }
}
