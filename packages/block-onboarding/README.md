# @23blocks/block-onboarding

Onboarding block for the 23blocks SDK - user onboarding flows and identity verification.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-onboarding.svg)](https://www.npmjs.com/package/@23blocks/block-onboarding)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-onboarding @23blocks/transport-http
```

## Overview

This package provides user onboarding functionality including:

- **Onboardings** - Onboarding configuration and management
- **Flows** - Multi-step onboarding flows
- **User Journeys** - Track user progress through onboarding
- **User Identities** - Identity verification during onboarding

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createOnboardingBlock } from '@23blocks/block-onboarding';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const onboarding = createOnboardingBlock(transport, {
  apiKey: 'your-api-key',
});

// Start user journey
const journey = await onboarding.userJourneys.start({
  flowId: 'flow-id',
  userId: 'user-id',
});

// Complete a step
await onboarding.userJourneys.completeStep({
  journeyId: journey.id,
  stepId: 'step-id',
  data: { agreed_to_terms: true },
});
```

## Services

### onboardings - Onboarding Configuration

```typescript
// List onboardings
const { data: onboardings } = await onboarding.onboardings.list();

// Get onboarding by ID
const ob = await onboarding.onboardings.get('onboarding-id');

// Create onboarding
const newOnboarding = await onboarding.onboardings.create({
  name: 'New User Onboarding',
  description: 'Onboarding flow for new users',
  type: 'signup',
  status: 'active',
});

// Update onboarding
await onboarding.onboardings.update('onboarding-id', {
  status: 'inactive',
});

// Delete onboarding
await onboarding.onboardings.delete('onboarding-id');
```

### flows - Flow Management

```typescript
// List flows
const { data: flows } = await onboarding.flows.list({
  onboardingId: 'onboarding-id',
});

// Get flow by ID
const flow = await onboarding.flows.get('flow-id');

// Create flow
const newFlow = await onboarding.flows.create({
  onboardingId: 'onboarding-id',
  name: 'Standard Flow',
  description: 'Standard onboarding for all users',
  steps: [
    {
      order: 1,
      name: 'Welcome',
      type: 'info',
      content: { title: 'Welcome!', message: 'Let\'s get started...' },
    },
    {
      order: 2,
      name: 'Profile',
      type: 'form',
      formId: 'profile-form-id',
      required: true,
    },
    {
      order: 3,
      name: 'Verify Email',
      type: 'verification',
      verificationType: 'email',
      required: true,
    },
    {
      order: 4,
      name: 'Complete',
      type: 'completion',
      content: { title: 'All done!', redirectUrl: '/dashboard' },
    },
  ],
});

// Update flow
await onboarding.flows.update('flow-id', {
  name: 'Updated Flow',
});

// Delete flow
await onboarding.flows.delete('flow-id');
```

### userJourneys - User Progress Tracking

```typescript
// List user journeys
const { data: journeys } = await onboarding.userJourneys.list({
  userId: 'user-id',
  status: 'in_progress',
});

// Get journey by ID
const journey = await onboarding.userJourneys.get('journey-id');

// Start journey
const newJourney = await onboarding.userJourneys.start({
  flowId: 'flow-id',
  userId: 'user-id',
  metadata: {
    source: 'signup',
    referrer: 'google',
  },
});

// Get current step
console.log('Current step:', journey.currentStep);
console.log('Progress:', journey.completedSteps.length, '/', journey.totalSteps);

// Complete step
await onboarding.userJourneys.completeStep({
  journeyId: journey.id,
  stepId: 'step-id',
  data: {
    firstName: 'John',
    lastName: 'Doe',
  },
});

// Skip step (if allowed)
await onboarding.userJourneys.skipStep({
  journeyId: journey.id,
  stepId: 'optional-step-id',
});

// Abandon journey
await onboarding.userJourneys.update(journey.id, {
  status: 'abandoned',
  abandonedAt: new Date().toISOString(),
  abandonReason: 'user_request',
});
```

### userIdentities - Identity Verification

```typescript
// List user identities
const { data: identities } = await onboarding.userIdentities.list({
  userId: 'user-id',
});

// Get identity by ID
const identity = await onboarding.userIdentities.get('identity-id');

// Create identity record
const newIdentity = await onboarding.userIdentities.create({
  userId: 'user-id',
  type: 'email',
  value: 'user@example.com',
  status: 'pending',
});

// Verify identity
const verified = await onboarding.userIdentities.verify({
  identityId: 'identity-id',
  code: '123456', // Verification code
});

if (verified.success) {
  console.log('Identity verified!');
} else {
  console.log('Verification failed:', verified.error);
}

// Resend verification
await onboarding.userIdentities.resendVerification('identity-id');

// Delete identity
await onboarding.userIdentities.delete('identity-id');
```

## Types

```typescript
import type {
  Onboarding,
  Flow,
  UserJourney,
  UserJourneyStatus,
  UserIdentity,
  CreateOnboardingRequest,
  CreateFlowRequest,
  StartJourneyRequest,
  CompleteStepRequest,
  CreateUserIdentityRequest,
  VerifyUserIdentityRequest,
} from '@23blocks/block-onboarding';
```

### UserJourneyStatus

- `not_started` - Journey created but not started
- `in_progress` - User is progressing through steps
- `completed` - All required steps completed
- `abandoned` - User abandoned the journey
- `expired` - Journey expired

### Flow Step Types

- `info` - Information display step
- `form` - Form submission step
- `verification` - Identity verification step
- `completion` - Final completion step
- `action` - Custom action step

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await onboarding.userIdentities.verify({
    identityId: 'id',
    code: 'wrong-code',
  });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case 'INVALID_CODE':
        console.log('Verification code is invalid');
        break;
      case 'CODE_EXPIRED':
        console.log('Verification code has expired');
        break;
      case 'MAX_ATTEMPTS':
        console.log('Too many attempts, please request a new code');
        break;
    }
  }
}
```

## Related Packages

- [`@23blocks/block-authentication`](https://www.npmjs.com/package/@23blocks/block-authentication) - User authentication
- [`@23blocks/block-forms`](https://www.npmjs.com/package/@23blocks/block-forms) - Form handling
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
