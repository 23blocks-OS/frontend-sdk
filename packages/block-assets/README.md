# @23blocks/block-assets

Assets block for the 23blocks SDK - asset tracking, events, and audits.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-assets.svg)](https://www.npmjs.com/package/@23blocks/block-assets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-assets @23blocks/transport-http
```

## Overview

This package provides asset management functionality including:

- **Assets** - Asset tracking and management
- **Asset Events** - Track asset lifecycle events
- **Asset Audits** - Audit trail and compliance

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createAssetsBlock } from '@23blocks/block-assets';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const assets = createAssetsBlock(transport, {
  apiKey: 'your-api-key',
});

// List assets
const { data: assetList } = await assets.assets.list({ limit: 20 });

// Get asset with events
const asset = await assets.assets.get('asset-id');
console.log(asset.name, asset.serialNumber, asset.status);
```

## Services

### assets - Asset Management

```typescript
// List assets
const { data: assetList, meta } = await assets.assets.list({
  limit: 20,
  status: 'active',
  category: 'equipment',
});

// Get asset by ID
const asset = await assets.assets.get('asset-id');

// Create asset
const newAsset = await assets.assets.create({
  name: 'MacBook Pro',
  serialNumber: 'ABC123XYZ',
  category: 'equipment',
  status: 'available',
  purchaseDate: '2024-01-15',
  purchasePrice: 2499.00,
  location: 'Office A',
  metadata: {
    specs: '16GB RAM, 512GB SSD',
  },
});

// Update asset
await assets.assets.update('asset-id', {
  status: 'in_use',
  location: 'Office B',
});

// Delete asset
await assets.assets.delete('asset-id');

// Transfer asset to new location
await assets.assets.transfer('asset-id', {
  toLocation: 'Warehouse',
  transferDate: new Date().toISOString(),
  notes: 'Moving to storage',
});

// Assign asset to user
await assets.assets.assign('asset-id', {
  userId: 'user-id',
  assignedAt: new Date().toISOString(),
  notes: 'Assigned to new employee',
});

// Unassign asset
await assets.assets.unassign('asset-id');
```

### assetEvents - Event Tracking

```typescript
// List events for an asset
const { data: events } = await assets.assetEvents.list({
  assetId: 'asset-id',
  limit: 50,
});

// Get event by ID
const event = await assets.assetEvents.get('event-id');

// Create event
const newEvent = await assets.assetEvents.create({
  assetId: 'asset-id',
  eventType: 'maintenance',
  description: 'Routine maintenance performed',
  eventDate: new Date().toISOString(),
  performedBy: 'user-id',
  cost: 150.00,
  notes: 'Replaced battery and cleaned fans',
});

// Update event
await assets.assetEvents.update('event-id', {
  notes: 'Updated maintenance notes',
});

// Delete event
await assets.assetEvents.delete('event-id');
```

### assetAudits - Audit Management

```typescript
// List audits
const { data: audits } = await assets.assetAudits.list({
  status: 'pending',
});

// Get audit by ID
const audit = await assets.assetAudits.get('audit-id');

// Create audit
const newAudit = await assets.assetAudits.create({
  name: 'Q4 2024 Inventory Audit',
  startDate: '2024-12-01',
  endDate: '2024-12-15',
  scope: 'all',
  assignedTo: 'user-id',
});

// Update audit
await assets.assetAudits.update('audit-id', {
  status: 'in_progress',
  notes: 'Started verification process',
});

// Complete audit
await assets.assetAudits.update('audit-id', {
  status: 'completed',
  completedAt: new Date().toISOString(),
  findings: {
    totalAssets: 150,
    verified: 148,
    discrepancies: 2,
  },
});

// Delete audit
await assets.assetAudits.delete('audit-id');
```

## Types

```typescript
import type {
  Asset,
  AssetEvent,
  AssetEventType,
  AssetAudit,
  CreateAssetRequest,
  UpdateAssetRequest,
  TransferAssetRequest,
  AssignAssetRequest,
  CreateAssetEventRequest,
  CreateAssetAuditRequest,
  ListAssetsParams,
} from '@23blocks/block-assets';
```

### Asset

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Asset ID |
| `uniqueId` | `string` | Unique identifier |
| `name` | `string` | Asset name |
| `serialNumber` | `string` | Serial number |
| `category` | `string` | Asset category |
| `status` | `string` | available, in_use, maintenance, retired |
| `location` | `string` | Current location |
| `assignedTo` | `string` | Assigned user ID |
| `purchaseDate` | `Date` | Purchase date |
| `purchasePrice` | `number` | Purchase price |
| `metadata` | `object` | Custom metadata |

### AssetEvent

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Event ID |
| `assetId` | `string` | Parent asset ID |
| `eventType` | `AssetEventType` | Type of event |
| `description` | `string` | Event description |
| `eventDate` | `Date` | When event occurred |
| `performedBy` | `string` | User who performed action |
| `cost` | `number` | Associated cost |

### AssetEventType

- `purchase` - Asset purchased
- `transfer` - Location transfer
- `assignment` - User assignment
- `maintenance` - Maintenance performed
- `repair` - Repair work
- `upgrade` - Asset upgrade
- `retirement` - Asset retired
- `disposal` - Asset disposed

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await assets.assets.assign('asset-id', { userId: 'user-id' });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.NOT_FOUND:
        console.log('Asset or user not found');
        break;
      case ErrorCodes.VALIDATION_ERROR:
        console.log('Asset is not available for assignment');
        break;
    }
  }
}
```

## Related Packages

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
