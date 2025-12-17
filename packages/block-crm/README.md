# @23blocks/block-crm

CRM block for the 23blocks SDK - accounts, contacts, leads, opportunities, meetings, and more.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-crm.svg)](https://www.npmjs.com/package/@23blocks/block-crm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-crm @23blocks/transport-http
```

## Overview

This package provides comprehensive CRM functionality including:

- **Accounts** - Company/organization management with documents
- **Contacts** - Contact management with profiles and events
- **Leads** - Lead tracking and follow-ups
- **Opportunities** - Sales pipeline management
- **Meetings** - Meeting scheduling with participants and billing
- **Quotes** - Quote generation and management
- **Subscribers** - Newsletter/subscription management
- **Referrals** - Referral tracking
- **Touches** - Interaction logging
- **Calendar** - Calendar integration with Zoom support

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createCrmBlock } from '@23blocks/block-crm';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const crm = createCrmBlock(transport, {
  apiKey: 'your-api-key',
});

// List contacts
const { data: contacts } = await crm.contacts.list({ limit: 20 });

// Create a lead
const lead = await crm.leads.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  source: 'website',
});
```

## Services

### accounts - Account Management

```typescript
// List accounts
const { data: accounts } = await crm.accounts.list({ limit: 20 });

// Get account by ID
const account = await crm.accounts.get('account-id');

// Create account
const newAccount = await crm.accounts.create({
  name: 'Acme Corp',
  industry: 'Technology',
  website: 'https://acme.com',
});

// Update account
await crm.accounts.update('account-id', { industry: 'Software' });

// Delete account
await crm.accounts.delete('account-id');

// Account documents
const { data: docs } = await crm.accounts.listDocuments('account-id');
await crm.accounts.addDocument('account-id', { name: 'Contract', fileId: 'file-id' });
```

### contacts - Contact Management

```typescript
// List contacts
const { data: contacts } = await crm.contacts.list({ accountId: 'account-id' });

// Create contact
const contact = await crm.contacts.create({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  accountId: 'account-id',
});

// Update contact
await crm.contacts.update('contact-id', { phone: '+1234567890' });

// Get contact profile
const profile = await crm.contacts.getProfile('contact-id');
```

### contactEvents - Contact Events

```typescript
// List events for contact
const { data: events } = await crm.contactEvents.list({ contactId: 'contact-id' });

// Create event
const event = await crm.contactEvents.create({
  contactId: 'contact-id',
  eventType: 'meeting',
  scheduledAt: '2024-12-01T10:00:00Z',
});

// Confirm event
await crm.contactEvents.confirm('event-id', { confirmed: true });

// Check in/out
await crm.contactEvents.checkin('event-id', { checkedInAt: new Date().toISOString() });
await crm.contactEvents.checkout('event-id', { checkedOutAt: new Date().toISOString() });
```

### leads - Lead Management

```typescript
// List leads
const { data: leads } = await crm.leads.list({ status: 'new' });

// Create lead
const lead = await crm.leads.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  source: 'website',
  status: 'new',
});

// Update lead status
await crm.leads.update('lead-id', { status: 'qualified' });

// Convert lead to contact
await crm.leads.convert('lead-id', { accountId: 'account-id' });
```

### leadFollows - Lead Follow-ups

```typescript
// List follow-ups
const { data: follows } = await crm.leadFollows.list({ leadId: 'lead-id' });

// Create follow-up
const follow = await crm.leadFollows.create({
  leadId: 'lead-id',
  followType: 'call',
  scheduledAt: '2024-12-01T10:00:00Z',
  notes: 'Initial call',
});
```

### opportunities - Opportunity Management

```typescript
// List opportunities
const { data: opps } = await crm.opportunities.list({ stage: 'negotiation' });

// Create opportunity
const opp = await crm.opportunities.create({
  name: 'Enterprise Deal',
  accountId: 'account-id',
  stage: 'discovery',
  value: 50000,
  closeDate: '2024-12-31',
});

// Update stage
await crm.opportunities.update('opp-id', { stage: 'closed_won' });
```

### meetings - Meeting Management

```typescript
// List meetings
const { data: meetings } = await crm.meetings.list({ startDate: '2024-12-01' });

// Create meeting
const meeting = await crm.meetings.create({
  title: 'Sales Review',
  startTime: '2024-12-01T10:00:00Z',
  endTime: '2024-12-01T11:00:00Z',
  accountId: 'account-id',
});

// Add participant
await crm.meetingParticipants.create({
  meetingId: 'meeting-id',
  contactId: 'contact-id',
});

// Meeting billing
await crm.meetingBillings.create({
  meetingId: 'meeting-id',
  amount: 100,
  payerId: 'payer-id',
});
```

### quotes - Quote Management

```typescript
// List quotes
const { data: quotes } = await crm.quotes.list({ opportunityId: 'opp-id' });

// Create quote
const quote = await crm.quotes.create({
  opportunityId: 'opp-id',
  name: 'Q-2024-001',
  validUntil: '2024-12-31',
  items: [{ productId: 'prod-id', quantity: 1, price: 1000 }],
});
```

### Calendar Integration

```typescript
// List calendar accounts
const { data: calendars } = await crm.calendarAccounts.list();

// Sync calendar
await crm.calendarAccounts.sync('calendar-id');

// Create busy block
await crm.busyBlocks.create({
  startTime: '2024-12-01T12:00:00Z',
  endTime: '2024-12-01T13:00:00Z',
  reason: 'Lunch',
});

// Zoom integration
const { data: hosts } = await crm.zoomHosts.list();
await crm.zoomMeetings.provision({ hostId: 'host-id', meetingId: 'meeting-id' });
```

## Types

```typescript
import type {
  Account, Contact, Lead, Opportunity, Meeting, Quote,
  CreateAccountRequest, CreateContactRequest, CreateLeadRequest,
  CreateOpportunityRequest, CreateMeetingRequest, CreateQuoteRequest,
} from '@23blocks/block-crm';
```

## Related Packages

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
