# @23blocks/block-forms

Forms block for the 23blocks SDK - dynamic forms, schemas, submissions, landings, surveys, appointments, subscriptions, referrals, and mail templates.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-forms.svg)](https://www.npmjs.com/package/@23blocks/block-forms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-forms @23blocks/transport-http
```

## Overview

This package provides form building and submission functionality including:

- **Forms** - Form definitions and configurations
- **Form Schemas** - Field definitions with datasource configuration
- **Form Schema Versions** - Published schema versions
- **Form Instances** - App form assignments with responses
- **Form Sets** - Groups of related form schemas with auto-assignment
- **Landings** - Landing page form submissions
- **Surveys** - Survey form submissions with magic link support
- **Appointments** - Appointment scheduling with location and assignment
- **Subscriptions** - Newsletter and subscription management
- **Referrals** - Referral tracking with source attribution
- **Mail Templates** - Email template configuration
- **Application Forms** - Public form submission and draft workflows
- **CRM Sync** - Synchronize form data with CRM

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createFormsBlock } from '@23blocks/block-forms';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const forms = createFormsBlock(transport, {
  apiKey: 'your-api-key',
});

// List forms
const { data: formList } = await forms.forms.list();

// Create a landing submission
await forms.landings.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  message: 'Hello!',
});
```

## Services

### forms - Form Management

```typescript
// List forms
const { data: formList } = await forms.forms.list({
  perPage: 20,
  status: 'active',
});

// Get form by ID
const form = await forms.forms.get('form-id');

// Create form
const newForm = await forms.forms.create({
  code: 'contact-form',
  name: 'Contact Form',
  description: 'Contact us form',
  formType: 'landing',
  sendConfirmationMail: true,
  requireOtpVerification: false,
});

// Update form
await forms.forms.update('form-id', {
  name: 'Updated Contact Form',
  status: 'inactive',
});

// Delete form
await forms.forms.delete('form-id');
```

### formSchemas - Schema Management

```typescript
// List schemas
const { data: schemas } = await forms.formSchemas.list({
  formUniqueId: 'form-id',
});

// Create schema
const newSchema = await forms.formSchemas.create({
  formUniqueId: 'form-id',
  name: 'Contact Schema',
  formFields: {
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
    ],
  },
  datasource: {},
});

// Update schema
await forms.formSchemas.update('schema-id', {
  formFields: { /* updated fields */ },
});
```

### formInstances - App Form Instances

```typescript
// List instances
const { data: instances } = await forms.formInstances.list({
  userUniqueId: 'user-id',
  status: 'active',
});

// Create an instance (assignment)
const instance = await forms.formInstances.create('form-id', {
  assignedToEmail: 'user@example.com',
  assignedToName: 'John Doe',
  assignedByName: 'Admin',
  expiresAt: '2025-12-31',
});

// Update instance
await forms.formInstances.update('instance-id', {
  responses: [{ fieldId: 'name', value: 'John Doe' }],
  status: 'completed',
});
```

### formSets - Form Set Management

```typescript
// List form sets
const { data: sets } = await forms.formSets.list();

// Create form set
const newSet = await forms.formSets.create({
  code: 'onboarding',
  name: 'Onboarding Forms',
  description: 'Forms required for new user onboarding',
  enforceSequential: true,
  expirationDays: 30,
  formSetItemsAttributes: [
    { formSchemaUniqueId: 'schema-1', displayOrder: 1, required: true },
    { formSchemaUniqueId: 'schema-2', displayOrder: 2, required: false },
  ],
});

// Match form set
const match = await forms.formSets.match({
  userUniqueId: 'user-id',
  category: 'onboarding',
});

// Auto-assign form set
await forms.formSets.autoAssign({
  userUniqueId: 'user-id',
  formSetUniqueId: 'set-id',
  assignedByName: 'System',
});
```

### landings - Landing Form Submissions

```typescript
const landing = await forms.landings.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  message: 'I am interested in your product',
  source: 'website',
});
```

### appointments - Appointment Scheduling

```typescript
const appointment = await forms.appointments.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  startAt: '2025-06-15T10:00:00Z',
  endAt: '2025-06-15T11:00:00Z',
  locationName: 'Main Office',
  locationAddress: '123 Main St',
  assignedToName: 'Dr. Smith',
});
```

## Types

```typescript
import type {
  Form,
  FormSchema,
  FormSchemaVersion,
  FormInstance,
  FormSet,
  FormSetItem,
  Landing,
  Survey,
  Appointment,
  Subscription,
  Referral,
  MailTemplate,
  CreateFormRequest,
  CreateFormSchemaRequest,
  CreateFormInstanceRequest,
  CreateFormSetRequest,
} from '@23blocks/block-forms';
```

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await forms.landings.create({
    firstName: 'John',
    email: 'john@example.com',
  });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.VALIDATION_ERROR:
        console.log('Form validation failed:', error.meta?.errors);
        break;
      case ErrorCodes.NOT_FOUND:
        console.log('Form not found');
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
