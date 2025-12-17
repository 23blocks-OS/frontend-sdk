# @23blocks/block-geolocation

Geolocation block for the 23blocks SDK - locations, addresses, areas, regions, and premises.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-geolocation.svg)](https://www.npmjs.com/package/@23blocks/block-geolocation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-geolocation @23blocks/transport-http
```

## Overview

This package provides geolocation and location management functionality including:

- **Locations** - Point locations with coordinates
- **Addresses** - Street addresses
- **Areas** - Geographic areas/zones
- **Regions** - Larger geographic regions
- **Travel Routes** - Route planning and tracking
- **Premises** - Physical premises/buildings
- **Premise Bookings** - Booking/reservation management

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createGeolocationBlock } from '@23blocks/block-geolocation';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const geo = createGeolocationBlock(transport, {
  apiKey: 'your-api-key',
});

// List locations
const { data: locations } = await geo.locations.list({ limit: 20 });

// Create an address
const address = await geo.addresses.create({
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'US',
});
```

## Services

### locations - Location Management

```typescript
// List locations
const { data: locations } = await geo.locations.list({
  limit: 20,
  areaId: 'area-id',
});

// Get location by ID
const location = await geo.locations.get('location-id');

// Create location
const newLocation = await geo.locations.create({
  name: 'Office',
  latitude: 40.7128,
  longitude: -74.0060,
  areaId: 'area-id',
});

// Update location
await geo.locations.update('location-id', {
  name: 'Main Office',
});

// Delete location
await geo.locations.delete('location-id');

// Find nearby locations
const nearby = await geo.locations.findNearby({
  latitude: 40.7128,
  longitude: -74.0060,
  radius: 10, // km
});
```

### addresses - Address Management

```typescript
// List addresses
const { data: addresses } = await geo.addresses.list({
  entityType: 'user',
  entityId: 'user-id',
});

// Get address by ID
const address = await geo.addresses.get('address-id');

// Create address
const newAddress = await geo.addresses.create({
  label: 'Home',
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'US',
  entityType: 'user',
  entityId: 'user-id',
});

// Update address
await geo.addresses.update('address-id', {
  street: '456 Oak Ave',
});

// Delete address
await geo.addresses.delete('address-id');

// Geocode address
const geocoded = await geo.addresses.geocode('address-id');
console.log(geocoded.latitude, geocoded.longitude);
```

### areas - Area Management

```typescript
// List areas
const { data: areas } = await geo.areas.list({ regionId: 'region-id' });

// Get area by ID
const area = await geo.areas.get('area-id');

// Create area
const newArea = await geo.areas.create({
  name: 'Downtown',
  regionId: 'region-id',
  boundaries: [
    { latitude: 40.7128, longitude: -74.0060 },
    { latitude: 40.7200, longitude: -74.0060 },
    // ... more coordinates
  ],
});

// Update area
await geo.areas.update('area-id', { name: 'Downtown Manhattan' });

// Delete area
await geo.areas.delete('area-id');
```

### regions - Region Management

```typescript
// List regions
const { data: regions } = await geo.regions.list();

// Get region by ID
const region = await geo.regions.get('region-id');

// Create region
const newRegion = await geo.regions.create({
  name: 'Northeast',
  code: 'NE',
});

// Update region
await geo.regions.update('region-id', { name: 'Northeast US' });

// Delete region
await geo.regions.delete('region-id');
```

### travelRoutes - Route Management

```typescript
// List routes
const { data: routes } = await geo.travelRoutes.list();

// Get route by ID
const route = await geo.travelRoutes.get('route-id');

// Create route
const newRoute = await geo.travelRoutes.create({
  name: 'Delivery Route A',
  origin: { latitude: 40.7128, longitude: -74.0060 },
  destination: { latitude: 40.7580, longitude: -73.9855 },
  waypoints: [],
});

// Calculate route
const calculated = await geo.travelRoutes.calculate('route-id');
console.log(calculated.distance, calculated.duration);
```

### premises - Premise Management

```typescript
// List premises
const { data: premises } = await geo.premises.list({ areaId: 'area-id' });

// Get premise by ID
const premise = await geo.premises.get('premise-id');

// Create premise
const newPremise = await geo.premises.create({
  name: 'Conference Room A',
  locationId: 'location-id',
  capacity: 20,
  amenities: ['projector', 'whiteboard'],
});

// Update premise
await geo.premises.update('premise-id', { capacity: 25 });

// Delete premise
await geo.premises.delete('premise-id');
```

### premiseBookings - Booking Management

```typescript
// List bookings
const { data: bookings } = await geo.premiseBookings.list({
  premiseId: 'premise-id',
  startDate: '2024-12-01',
});

// Create booking
const booking = await geo.premiseBookings.create({
  premiseId: 'premise-id',
  title: 'Team Meeting',
  startTime: '2024-12-01T10:00:00Z',
  endTime: '2024-12-01T11:00:00Z',
  attendees: 10,
});

// Update booking
await geo.premiseBookings.update('booking-id', {
  endTime: '2024-12-01T12:00:00Z',
});

// Cancel booking
await geo.premiseBookings.delete('booking-id');

// Check availability
const available = await geo.premiseBookings.checkAvailability({
  premiseId: 'premise-id',
  startTime: '2024-12-01T10:00:00Z',
  endTime: '2024-12-01T11:00:00Z',
});
```

## Types

```typescript
import type {
  Location,
  Address,
  Area,
  Region,
  TravelRoute,
  Premise,
  PremiseBooking,
  CreateLocationRequest,
  CreateAddressRequest,
  CreatePremiseBookingRequest,
} from '@23blocks/block-geolocation';
```

## Related Packages

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
