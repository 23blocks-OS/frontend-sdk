// @ts-nocheck
import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createGeolocationBlock,
  type GeolocationBlock,
  type GeolocationBlockConfig,
  // Location types
  type Location,
  type CreateLocationRequest,
  type UpdateLocationRequest,
  type ListLocationsParams,
  // Address types
  type Address,
  type CreateAddressRequest,
  type UpdateAddressRequest,
  type ListAddressesParams,
  // Area types
  type Area,
  type CreateAreaRequest,
  type UpdateAreaRequest,
  type ListAreasParams,
  // Region types
  type Region,
  type CreateRegionRequest,
  type UpdateRegionRequest,
  type ListRegionsParams,
  // Travel Route types
  type TravelRoute,
  type CreateTravelRouteRequest,
  type UpdateTravelRouteRequest,
  type ListTravelRoutesParams,
  // Premise Booking types
  type PremiseBooking,
  type CreatePremiseBookingRequest,
  type UpdatePremiseBookingRequest,
  type ListPremiseBookingsParams,
  // Premise types
  type Premise,
  type CreatePremiseRequest,
  type UpdatePremiseRequest,
  type ListPremisesParams,
  // Premise Event types
  type PremiseEvent,
  type CreatePremiseEventRequest,
  type UpdatePremiseEventRequest,
  type ListPremiseEventsParams,
  // Route Tracker types
  type RouteLocation,
  type CreateRouteLocationRequest,
  type RouteTrackerStatus,
  type ListRouteLocationsParams,
  // Location Hour types
  type LocationHour,
  type CreateLocationHourRequest,
  type UpdateLocationHourRequest,
  // Location Image types
  type LocationImage,
  type CreateLocationImageRequest,
  type PresignLocationImageRequest,
  type PresignLocationImageResponse,
  // Location Slot types
  type LocationSlot,
  type CreateLocationSlotRequest,
  type UpdateLocationSlotRequest,
  // Location Tax types
  type LocationTax,
  type CreateLocationTaxRequest,
  type UpdateLocationTaxRequest,
  // Location Group types
  type LocationGroup,
  type CreateLocationGroupRequest,
  type ListLocationGroupsParams,
  // Geo Identity types
  type GeoIdentity,
  type RegisterGeoIdentityRequest,
  type UpdateGeoIdentityRequest,
  type ListGeoIdentitiesParams,
  type LocationIdentityRequest,
  type UserLocationRequest,
  // Location Identity types
  type LocationIdentity,
  type CreateLocationIdentityRequest,
  type UpdateLocationIdentityRequest,
  type ListLocationIdentitiesParams,
  // Geo lookup types
  type GeoCountry,
  type GeoState,
  type GeoCity,
  type GeoLookupParams,
} from '@23blocks/block-geolocation';
import { TRANSPORT, GEOLOCATION_TRANSPORT, GEOLOCATION_CONFIG } from '../tokens';

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
  // Premise Events Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all premise events
   */
  listPremiseEvents(
    locationUniqueId: string,
    premiseUniqueId: string,
    params?: ListPremiseEventsParams
  ): Observable<PageResult<PremiseEvent>> {
    return from(this.ensureConfigured().premiseEvents.list(locationUniqueId, premiseUniqueId, params));
  }

  /**
   * Get a premise event by unique ID
   */
  getPremiseEvent(
    locationUniqueId: string,
    premiseUniqueId: string,
    uniqueId: string
  ): Observable<PremiseEvent> {
    return from(this.ensureConfigured().premiseEvents.get(locationUniqueId, premiseUniqueId, uniqueId));
  }

  /**
   * Create a new premise event
   */
  createPremiseEvent(
    locationUniqueId: string,
    premiseUniqueId: string,
    data: CreatePremiseEventRequest
  ): Observable<PremiseEvent> {
    return from(this.ensureConfigured().premiseEvents.create(locationUniqueId, premiseUniqueId, data));
  }

  /**
   * Update a premise event
   */
  updatePremiseEvent(
    locationUniqueId: string,
    premiseUniqueId: string,
    uniqueId: string,
    data: UpdatePremiseEventRequest
  ): Observable<PremiseEvent> {
    return from(this.ensureConfigured().premiseEvents.update(locationUniqueId, premiseUniqueId, uniqueId, data));
  }

  /**
   * Delete a premise event
   */
  deletePremiseEvent(
    locationUniqueId: string,
    premiseUniqueId: string,
    uniqueId: string
  ): Observable<void> {
    return from(this.ensureConfigured().premiseEvents.delete(locationUniqueId, premiseUniqueId, uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Route Tracker Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Record a location point for a route
   */
  recordRouteLocation(
    userUniqueId: string,
    routeUniqueId: string,
    data: CreateRouteLocationRequest
  ): Observable<RouteLocation> {
    return from(this.ensureConfigured().routeTracker.recordLocation(userUniqueId, routeUniqueId, data));
  }

  /**
   * Get route tracking status
   */
  getRouteTrackerStatus(userUniqueId: string, routeUniqueId: string): Observable<RouteTrackerStatus> {
    return from(this.ensureConfigured().routeTracker.getStatus(userUniqueId, routeUniqueId));
  }

  /**
   * List all recorded locations for a route
   */
  listRouteLocations(
    userUniqueId: string,
    routeUniqueId: string,
    params?: ListRouteLocationsParams
  ): Observable<PageResult<RouteLocation>> {
    return from(this.ensureConfigured().routeTracker.listLocations(userUniqueId, routeUniqueId, params));
  }

  /**
   * Start tracking for a route
   */
  startRouteTracking(userUniqueId: string, routeUniqueId: string): Observable<RouteTrackerStatus> {
    return from(this.ensureConfigured().routeTracker.startTracking(userUniqueId, routeUniqueId));
  }

  /**
   * Stop tracking for a route
   */
  stopRouteTracking(userUniqueId: string, routeUniqueId: string): Observable<RouteTrackerStatus> {
    return from(this.ensureConfigured().routeTracker.stopTracking(userUniqueId, routeUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Location Hours Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all hours for a location
   */
  listLocationHours(locationUniqueId: string): Observable<LocationHour[]> {
    return from(this.ensureConfigured().locationHours.list(locationUniqueId));
  }

  /**
   * Get a location hour by unique ID
   */
  getLocationHour(locationUniqueId: string, hourUniqueId: string): Observable<LocationHour> {
    return from(this.ensureConfigured().locationHours.get(locationUniqueId, hourUniqueId));
  }

  /**
   * Create a new location hour
   */
  createLocationHour(locationUniqueId: string, data: CreateLocationHourRequest): Observable<LocationHour> {
    return from(this.ensureConfigured().locationHours.create(locationUniqueId, data));
  }

  /**
   * Update a location hour
   */
  updateLocationHour(
    locationUniqueId: string,
    hourUniqueId: string,
    data: UpdateLocationHourRequest
  ): Observable<LocationHour> {
    return from(this.ensureConfigured().locationHours.update(locationUniqueId, hourUniqueId, data));
  }

  /**
   * Delete a location hour
   */
  deleteLocationHour(locationUniqueId: string, hourUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().locationHours.delete(locationUniqueId, hourUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Location Images Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get a presigned URL for uploading an image
   */
  presignLocationImage(
    locationUniqueId: string,
    data: PresignLocationImageRequest
  ): Observable<PresignLocationImageResponse> {
    return from(this.ensureConfigured().locationImages.presign(locationUniqueId, data));
  }

  /**
   * Create a new location image
   */
  createLocationImage(locationUniqueId: string, data: CreateLocationImageRequest): Observable<LocationImage> {
    return from(this.ensureConfigured().locationImages.create(locationUniqueId, data));
  }

  /**
   * Delete a location image
   */
  deleteLocationImage(locationUniqueId: string, imageUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().locationImages.delete(locationUniqueId, imageUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Location Slots Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all slots for a location
   */
  listLocationSlots(locationUniqueId: string): Observable<LocationSlot[]> {
    return from(this.ensureConfigured().locationSlots.list(locationUniqueId));
  }

  /**
   * Get a location slot by unique ID
   */
  getLocationSlot(locationUniqueId: string, slotUniqueId: string): Observable<LocationSlot> {
    return from(this.ensureConfigured().locationSlots.get(locationUniqueId, slotUniqueId));
  }

  /**
   * Create a new location slot
   */
  createLocationSlot(locationUniqueId: string, data: CreateLocationSlotRequest): Observable<LocationSlot> {
    return from(this.ensureConfigured().locationSlots.create(locationUniqueId, data));
  }

  /**
   * Update a location slot
   */
  updateLocationSlot(
    locationUniqueId: string,
    slotUniqueId: string,
    data: UpdateLocationSlotRequest
  ): Observable<LocationSlot> {
    return from(this.ensureConfigured().locationSlots.update(locationUniqueId, slotUniqueId, data));
  }

  /**
   * Delete a location slot
   */
  deleteLocationSlot(locationUniqueId: string, slotUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().locationSlots.delete(locationUniqueId, slotUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Location Taxes Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Create a new location tax
   */
  createLocationTax(locationUniqueId: string, data: CreateLocationTaxRequest): Observable<LocationTax> {
    return from(this.ensureConfigured().locationTaxes.create(locationUniqueId, data));
  }

  /**
   * Update a location tax
   */
  updateLocationTax(
    locationUniqueId: string,
    taxUniqueId: string,
    data: UpdateLocationTaxRequest
  ): Observable<LocationTax> {
    return from(this.ensureConfigured().locationTaxes.update(locationUniqueId, taxUniqueId, data));
  }

  /**
   * Delete a location tax
   */
  deleteLocationTax(locationUniqueId: string, taxUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().locationTaxes.delete(locationUniqueId, taxUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Location Groups Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all location groups
   */
  listLocationGroups(params?: ListLocationGroupsParams): Observable<PageResult<LocationGroup>> {
    return from(this.ensureConfigured().locationGroups.list(params));
  }

  /**
   * Get a location group by unique ID
   */
  getLocationGroup(uniqueId: string): Observable<LocationGroup> {
    return from(this.ensureConfigured().locationGroups.get(uniqueId));
  }

  /**
   * Create a new location group
   */
  createLocationGroup(data: CreateLocationGroupRequest): Observable<LocationGroup> {
    return from(this.ensureConfigured().locationGroups.create(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Geo Identities Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all geo identities
   */
  listGeoIdentities(params?: ListGeoIdentitiesParams): Observable<PageResult<GeoIdentity>> {
    return from(this.ensureConfigured().identities.list(params));
  }

  /**
   * Get a geo identity by unique ID
   */
  getGeoIdentity(uniqueId: string): Observable<GeoIdentity> {
    return from(this.ensureConfigured().identities.get(uniqueId));
  }

  /**
   * Register a geo identity
   */
  registerGeoIdentity(uniqueId: string, data: RegisterGeoIdentityRequest): Observable<GeoIdentity> {
    return from(this.ensureConfigured().identities.register(uniqueId, data));
  }

  /**
   * Update a geo identity
   */
  updateGeoIdentity(uniqueId: string, data: UpdateGeoIdentityRequest): Observable<GeoIdentity> {
    return from(this.ensureConfigured().identities.update(uniqueId, data));
  }

  /**
   * Delete a geo identity
   */
  deleteGeoIdentity(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().identities.delete(uniqueId));
  }

  /**
   * Add an identity to a location
   */
  addIdentityToLocation(locationUniqueId: string, data: LocationIdentityRequest): Observable<void> {
    return from(this.ensureConfigured().identities.addToLocation(locationUniqueId, data));
  }

  /**
   * Remove an identity from a location
   */
  removeIdentityFromLocation(locationUniqueId: string, userUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().identities.removeFromLocation(locationUniqueId, userUniqueId));
  }

  /**
   * Update a user's location
   */
  updateUserLocation(userUniqueId: string, data: UserLocationRequest): Observable<void> {
    return from(this.ensureConfigured().identities.updateLocation(userUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Location Identities Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all location identities
   */
  listLocationIdentities(params?: ListLocationIdentitiesParams): Observable<PageResult<LocationIdentity>> {
    return from(this.ensureConfigured().locationIdentities.list(params));
  }

  /**
   * Get a location identity by unique ID
   */
  getLocationIdentity(uniqueId: string): Observable<LocationIdentity> {
    return from(this.ensureConfigured().locationIdentities.get(uniqueId));
  }

  /**
   * Create a new location identity
   */
  createLocationIdentity(data: CreateLocationIdentityRequest): Observable<LocationIdentity> {
    return from(this.ensureConfigured().locationIdentities.create(data));
  }

  /**
   * Update a location identity
   */
  updateLocationIdentity(uniqueId: string, data: UpdateLocationIdentityRequest): Observable<LocationIdentity> {
    return from(this.ensureConfigured().locationIdentities.update(uniqueId, data));
  }

  /**
   * Delete a location identity
   */
  deleteLocationIdentity(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().locationIdentities.delete(uniqueId));
  }

  /**
   * Check in an identity at a location
   */
  checkInLocationIdentity(
    locationUniqueId: string,
    identityUniqueId: string,
    identityType: string
  ): Observable<LocationIdentity> {
    return from(this.ensureConfigured().locationIdentities.checkIn(locationUniqueId, identityUniqueId, identityType));
  }

  /**
   * Check out an identity from a location
   */
  checkOutLocationIdentity(uniqueId: string): Observable<LocationIdentity> {
    return from(this.ensureConfigured().locationIdentities.checkOut(uniqueId));
  }

  /**
   * List identities by location
   */
  listLocationIdentitiesByLocation(
    locationUniqueId: string,
    params?: ListLocationIdentitiesParams
  ): Observable<PageResult<LocationIdentity>> {
    return from(this.ensureConfigured().locationIdentities.listByLocation(locationUniqueId, params));
  }

  /**
   * List identities by identity
   */
  listLocationIdentitiesByIdentity(
    identityUniqueId: string,
    identityType: string,
    params?: ListLocationIdentitiesParams
  ): Observable<PageResult<LocationIdentity>> {
    return from(this.ensureConfigured().locationIdentities.listByIdentity(identityUniqueId, identityType, params));
  }

  /**
   * Get current location for an identity
   */
  getCurrentLocationForIdentity(
    identityUniqueId: string,
    identityType: string
  ): Observable<LocationIdentity | null> {
    return from(this.ensureConfigured().locationIdentities.getCurrentLocation(identityUniqueId, identityType));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Geo Countries Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all countries
   */
  listGeoCountries(params?: GeoLookupParams): Observable<PageResult<GeoCountry>> {
    return from(this.ensureConfigured().geoCountries.list(params));
  }

  /**
   * Get a country by code
   */
  getGeoCountry(code: string): Observable<GeoCountry> {
    return from(this.ensureConfigured().geoCountries.get(code));
  }

  /**
   * Search countries by name
   */
  searchGeoCountries(query: string, params?: GeoLookupParams): Observable<PageResult<GeoCountry>> {
    return from(this.ensureConfigured().geoCountries.search(query, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Geo States Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List states by country
   */
  listGeoStates(countryCode: string, params?: GeoLookupParams): Observable<PageResult<GeoState>> {
    return from(this.ensureConfigured().geoStates.listByCountry(countryCode, params));
  }

  /**
   * Get a state by code
   */
  getGeoState(code: string): Observable<GeoState> {
    return from(this.ensureConfigured().geoStates.get(code));
  }

  /**
   * Search states by name
   */
  searchGeoStates(query: string, countryCode?: string, params?: GeoLookupParams): Observable<PageResult<GeoState>> {
    return from(this.ensureConfigured().geoStates.search(query, countryCode, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Geo Cities Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List cities by state or country
   */
  listGeoCities(countryCode: string, stateCode?: string, params?: GeoLookupParams): Observable<PageResult<GeoCity>> {
    return from(this.ensureConfigured().geoCities.list(countryCode, stateCode, params));
  }

  /**
   * Get a city by code
   */
  getGeoCity(code: string): Observable<GeoCity> {
    return from(this.ensureConfigured().geoCities.get(code));
  }

  /**
   * Search cities by name
   */
  searchGeoCities(query: string, countryCode?: string, stateCode?: string, params?: GeoLookupParams): Observable<PageResult<GeoCity>> {
    return from(this.ensureConfigured().geoCities.search(query, countryCode, stateCode, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get geolocationBlock(): GeolocationBlock {
    return this.ensureConfigured();
  }
}
