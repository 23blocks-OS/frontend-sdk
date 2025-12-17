# @23blocks/block-forms

Forms block for the 23blocks SDK - dynamic forms, schemas, and submissions.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-forms.svg)](https://www.npmjs.com/package/@23blocks/block-forms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-forms @23blocks/transport-http
```

## Overview

This package provides form building and submission functionality including:

- **Forms** - Form definitions and configurations
- **Form Schemas** - Field definitions and validations
- **Form Instances** - Individual form submissions
- **Form Sets** - Groups of related forms

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

// Submit a form
const submission = await forms.formInstances.submit({
  formId: 'form-id',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!',
  },
});
```

## Services

### forms - Form Management

```typescript
// List forms
const { data: formList } = await forms.forms.list({
  limit: 20,
  status: 'active',
});

// Get form by ID
const form = await forms.forms.get('form-id');

// Create form
const newForm = await forms.forms.create({
  name: 'Contact Form',
  description: 'Contact us form',
  status: 'active',
  schemaId: 'schema-id',
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
const { data: schemas } = await forms.formSchemas.list();

// Get schema by ID
const schema = await forms.formSchemas.get('schema-id');

// Create schema
const newSchema = await forms.formSchemas.create({
  name: 'Contact Schema',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Your Name',
      required: true,
      validation: { minLength: 2, maxLength: 100 },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
      validation: { minLength: 10, maxLength: 1000 },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priority',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
    },
  ],
});

// Update schema
await forms.formSchemas.update('schema-id', {
  fields: [
    // updated fields
  ],
});

// Delete schema
await forms.formSchemas.delete('schema-id');
```

### formInstances - Form Submissions

```typescript
// List submissions
const { data: submissions } = await forms.formInstances.list({
  formId: 'form-id',
  status: 'submitted',
});

// Get submission by ID
const submission = await forms.formInstances.get('instance-id');

// Create a draft instance
const draft = await forms.formInstances.create({
  formId: 'form-id',
  data: {
    name: 'John',
  },
  status: 'draft',
});

// Update draft
await forms.formInstances.update('instance-id', {
  data: {
    name: 'John Doe',
    email: 'john@example.com',
  },
});

// Submit form
const submitted = await forms.formInstances.submit({
  formId: 'form-id',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I have a question...',
  },
});

// Delete submission
await forms.formInstances.delete('instance-id');
```

### formSets - Form Set Management

```typescript
// List form sets
const { data: sets } = await forms.formSets.list();

// Get form set by ID
const formSet = await forms.formSets.get('set-id');

// Create form set
const newSet = await forms.formSets.create({
  name: 'Onboarding Forms',
  description: 'Forms required for new user onboarding',
  formReferences: [
    { formId: 'form-1', order: 1, required: true },
    { formId: 'form-2', order: 2, required: false },
    { formId: 'form-3', order: 3, required: true },
  ],
});

// Update form set
await forms.formSets.update('set-id', {
  formReferences: [
    { formId: 'form-1', order: 1, required: true },
    { formId: 'form-2', order: 2, required: true },
  ],
});

// Delete form set
await forms.formSets.delete('set-id');
```

## Types

```typescript
import type {
  Form,
  FormSchema,
  FormInstance,
  FormSet,
  FormReference,
  CreateFormRequest,
  CreateFormSchemaRequest,
  CreateFormInstanceRequest,
  SubmitFormInstanceRequest,
  CreateFormSetRequest,
} from '@23blocks/block-forms';
```

### Form

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Form ID |
| `uniqueId` | `string` | Unique identifier |
| `name` | `string` | Form name |
| `description` | `string` | Form description |
| `status` | `string` | active, inactive, archived |
| `schemaId` | `string` | Associated schema ID |
| `schema` | `FormSchema` | Schema details |

### FormSchema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Schema ID |
| `name` | `string` | Schema name |
| `fields` | `Field[]` | Field definitions |
| `validations` | `object` | Form-level validations |

### FormInstance

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Instance ID |
| `formId` | `string` | Parent form ID |
| `data` | `object` | Submitted data |
| `status` | `string` | draft, submitted, approved, rejected |
| `submittedAt` | `Date` | Submission timestamp |

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await forms.formInstances.submit({
    formId: 'form-id',
    data: { name: '' }, // Invalid - name is required
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
