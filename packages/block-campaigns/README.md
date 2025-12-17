# @23blocks/block-campaigns

Campaigns block for the 23blocks SDK - marketing campaigns, media, landing pages, and audiences.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-campaigns.svg)](https://www.npmjs.com/package/@23blocks/block-campaigns)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-campaigns @23blocks/transport-http
```

## Overview

This package provides marketing campaign functionality including:

- **Campaigns** - Campaign management and tracking
- **Campaign Media** - Media assets for campaigns
- **Landing Pages** - Landing page management
- **Audiences** - Target audience management

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createCampaignsBlock } from '@23blocks/block-campaigns';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const campaigns = createCampaignsBlock(transport, {
  apiKey: 'your-api-key',
});

// List active campaigns
const { data: campaignList } = await campaigns.campaigns.list({
  status: 'active',
  limit: 20,
});

campaignList.forEach((campaign) => {
  console.log(campaign.name, campaign.startDate, campaign.endDate);
});
```

## Services

### campaigns - Campaign Management

```typescript
// List campaigns
const { data: campaignList } = await campaigns.campaigns.list({
  limit: 20,
  status: 'active',
});

// Get campaign by ID
const campaign = await campaigns.campaigns.get('campaign-id');

// Create campaign
const newCampaign = await campaigns.campaigns.create({
  name: 'Summer Sale 2024',
  description: 'Annual summer promotion',
  type: 'promotion',
  startDate: '2024-06-01',
  endDate: '2024-08-31',
  budget: 10000,
  status: 'draft',
});

// Update campaign
await campaigns.campaigns.update('campaign-id', {
  status: 'active',
  budget: 15000,
});

// Delete campaign
await campaigns.campaigns.delete('campaign-id');

// Get campaign results
const results = await campaigns.campaigns.getResults('campaign-id');
console.log(results.impressions, results.clicks, results.conversions);
```

### campaignMedia - Media Management

```typescript
// List media for campaign
const { data: mediaList } = await campaigns.campaignMedia.list({
  campaignId: 'campaign-id',
});

// Get media by ID
const media = await campaigns.campaignMedia.get('media-id');

// Create campaign media
const newMedia = await campaigns.campaignMedia.create({
  campaignId: 'campaign-id',
  name: 'Banner Ad',
  type: 'image',
  fileId: 'file-id',
  placement: 'homepage_banner',
  status: 'active',
});

// Update media
await campaigns.campaignMedia.update('media-id', {
  status: 'paused',
});

// Delete media
await campaigns.campaignMedia.delete('media-id');

// Get media results
const results = await campaigns.campaignMedia.getResults('media-id');
console.log(results.impressions, results.clicks, results.ctr);
```

### landingPages - Landing Page Management

```typescript
// List landing pages
const { data: pages } = await campaigns.landingPages.list({
  campaignId: 'campaign-id',
});

// Get landing page by ID
const page = await campaigns.landingPages.get('page-id');

// Create landing page
const newPage = await campaigns.landingPages.create({
  campaignId: 'campaign-id',
  name: 'Summer Sale Landing',
  slug: 'summer-sale-2024',
  title: 'Summer Sale - Up to 50% Off',
  content: '<h1>Summer Sale</h1>...',
  status: 'published',
});

// Update landing page
await campaigns.landingPages.update('page-id', {
  content: '<h1>Updated Content</h1>...',
});

// Delete landing page
await campaigns.landingPages.delete('page-id');
```

### audiences - Audience Management

```typescript
// List audiences
const { data: audiences } = await campaigns.audiences.list();

// Get audience by ID
const audience = await campaigns.audiences.get('audience-id');

// Create audience
const newAudience = await campaigns.audiences.create({
  name: 'Premium Customers',
  description: 'Customers with lifetime value > $1000',
  criteria: {
    minLifetimeValue: 1000,
    segments: ['active', 'returning'],
  },
});

// Update audience
await campaigns.audiences.update('audience-id', {
  criteria: {
    minLifetimeValue: 1500,
  },
});

// Delete audience
await campaigns.audiences.delete('audience-id');

// Get audience members
const { data: members } = await campaigns.audiences.getMembers('audience-id', {
  limit: 100,
});

// Add member to audience
await campaigns.audiences.addMember('audience-id', {
  userId: 'user-id',
});

// Remove member from audience
await campaigns.audiences.removeMember('audience-id', 'member-id');
```

## Types

```typescript
import type {
  Campaign,
  CampaignResults,
  CampaignMedia,
  CampaignMediaResults,
  LandingPage,
  Audience,
  AudienceMember,
  CreateCampaignRequest,
  CreateCampaignMediaRequest,
  CreateLandingPageRequest,
  CreateAudienceRequest,
} from '@23blocks/block-campaigns';
```

### Campaign

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Campaign ID |
| `name` | `string` | Campaign name |
| `description` | `string` | Campaign description |
| `type` | `string` | Campaign type |
| `status` | `string` | draft, active, paused, completed |
| `startDate` | `Date` | Campaign start date |
| `endDate` | `Date` | Campaign end date |
| `budget` | `number` | Campaign budget |

### CampaignResults

| Property | Type | Description |
|----------|------|-------------|
| `impressions` | `number` | Total impressions |
| `clicks` | `number` | Total clicks |
| `conversions` | `number` | Total conversions |
| `spend` | `number` | Total spend |
| `revenue` | `number` | Total revenue |
| `roi` | `number` | Return on investment |

## Related Packages

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
