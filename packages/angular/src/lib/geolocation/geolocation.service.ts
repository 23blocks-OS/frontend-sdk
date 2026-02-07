import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createGeolocationBlock,
  type GeolocationBlock,
  type GeolocationBlockConfig,
} from '@23blocks/block-geolocation';
import { TRANSPORT, GEOLOCATION_TRANSPORT, GEOLOCATION_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Geolocation block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const locations = await this.geolocationService.locations.list();
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

  private ensureConfigured(): GeolocationBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] GeolocationService is not configured. ' +
        "Add 'urls.geolocation' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get locations() { return this.ensureConfigured().locations; }
  get addresses() { return this.ensureConfigured().addresses; }
  get areas() { return this.ensureConfigured().areas; }
  get regions() { return this.ensureConfigured().regions; }
  get routes() { return this.ensureConfigured().routes; }
  get bookings() { return this.ensureConfigured().bookings; }
  get premises() { return this.ensureConfigured().premises; }
  get premiseEvents() { return this.ensureConfigured().premiseEvents; }
  get routeTracker() { return this.ensureConfigured().routeTracker; }
  get locationHours() { return this.ensureConfigured().locationHours; }
  get locationImages() { return this.ensureConfigured().locationImages; }
  get locationSlots() { return this.ensureConfigured().locationSlots; }
  get locationTaxes() { return this.ensureConfigured().locationTaxes; }
  get locationGroups() { return this.ensureConfigured().locationGroups; }
  get identities() { return this.ensureConfigured().identities; }
  get locationIdentities() { return this.ensureConfigured().locationIdentities; }
  get geoCountries() { return this.ensureConfigured().geoCountries; }
  get geoStates() { return this.ensureConfigured().geoStates; }
  get geoCities() { return this.ensureConfigured().geoCities; }

  /** Full block access */
  get geolocationBlock(): GeolocationBlock { return this.ensureConfigured(); }
}
