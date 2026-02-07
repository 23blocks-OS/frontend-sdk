# @23blocks/angular

Angular bindings for the 23blocks SDK - Injectable services with typed delegation to block APIs.

[![npm version](https://img.shields.io/npm/v/@23blocks/angular.svg)](https://www.npmjs.com/package/@23blocks/angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **v7.0.0** - Complete rewrite from Observable wrappers to typed getter delegation. See [CHANGELOG.md](./CHANGELOG.md) for migration guide.

## Installation

```bash
npm install @23blocks/angular
```

## Overview

This package provides Angular-specific bindings for the 23blocks SDK:

- **Injectable Services** - All 18 blocks exposed as Angular services
- **Typed Delegation** - Services expose block sub-services via typed getters
- **Promise-based** - All methods return Promises (use `from()` for Observables)
- **Token Management** - Automatic token storage and refresh for auth flows
- **Dependency Injection** - Full DI support with providers
- **Zero Maintenance** - Getters auto-sync with block API types

## Quick Start

### 1. Configure providers

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideBlocks23 } from '@23blocks/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlocks23({
      apiKey: 'your-api-key',
      urls: {
        authentication: 'https://auth.yourapp.com',
        // Add other service URLs as needed
        // products: 'https://products.yourapp.com',
        // crm: 'https://crm.yourapp.com',
      },
    }),
  ],
};
```

### 2. Bootstrap with the config

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig);
```

### 3. Use the services

```typescript
import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@23blocks/angular';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="login()">
      <input [(ngModel)]="email" placeholder="Email" />
      <input [(ngModel)]="password" type="password" placeholder="Password" />
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  `,
})
export class LoginComponent {
  private auth = inject(AuthenticationService);

  email = '';
  password = '';
  loading = false;

  login() {
    this.loading = true;
    // Auth-flow methods return Observables with automatic token management
    this.auth.signIn({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Welcome', response.user.email);
        },
        error: (err) => {
          console.error('Login failed:', err.message);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
```

## Service Architecture

Services expose block sub-services through typed getters. Each getter returns the block's native service, which provides Promise-based methods.

```typescript
// All non-auth services use this pattern:
const products = inject(ProductsService);

// Access sub-services via getters
const list = await products.products.list({ page: 1, perPage: 20 });
const cart = await products.cart.get(cartId);
const categories = await products.categories.list();

// Or convert to Observables with from()
from(products.products.list()).subscribe(list => { ... });

// Full block access for advanced use cases
const block = products.productsBlock;
```

### AuthenticationService (Hybrid)

AuthenticationService is special: auth-flow methods that manage tokens return **Observables** with automatic `tap()` for token storage. All other sub-services are delegated via getters (Promise-based).

```typescript
const auth = inject(AuthenticationService);

// Observable methods (with token management):
auth.signIn({ email, password }).subscribe(...)
auth.signUp({ email, password, passwordConfirmation }).subscribe(...)
auth.signOut().subscribe(...)
auth.refreshToken({ refreshToken }).subscribe(...)
auth.facebookLogin({ accessToken }).subscribe(...)
auth.googleLogin({ accessToken }).subscribe(...)

// Promise-based sub-services (via getters):
const user = await auth.users.get(userId);
const roles = await auth.roles.list();
const keys = await auth.apiKeys.list();
from(auth.mfa.enable(userId)).subscribe(...)

// Token management:
auth.isAuthenticated()     // boolean | null
auth.getAccessToken()      // string | null
auth.clearTokens()         // void
```

## Configuration Options

### provideBlocks23 Options

```typescript
provideBlocks23({
  // Required: Your API key
  apiKey: 'your-api-key',

  // Required: Service URLs (only configure what you need)
  urls: {
    authentication: 'https://auth.yourapp.com',
    products: 'https://products.yourapp.com',
    crm: 'https://crm.yourapp.com',
    // ... other services
  },

  // Optional: Tenant ID for multi-tenant setups
  tenantId: 'tenant-123',

  // Optional: Authentication mode (default: 'token')
  authMode: 'token', // 'token' | 'cookie'

  // Optional: Token storage (default: 'localStorage')
  storage: 'localStorage', // 'localStorage' | 'sessionStorage' | 'memory'

  // Optional: Enable debug logging
  debug: !environment.production,
})
```

### Cookie Mode

```typescript
provideBlocks23({
  apiKey: 'your-api-key',
  urls: { authentication: 'https://auth.yourapp.com' },
  authMode: 'cookie',
})
```

### Multi-Tenant Setup

```typescript
provideBlocks23({
  apiKey: 'your-api-key',
  urls: { authentication: 'https://auth.yourapp.com' },
  tenantId: 'tenant-123',
})
```

### NgModule-based Applications

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { getBlocks23Providers } from '@23blocks/angular';

@NgModule({
  providers: [
    ...getBlocks23Providers({
      apiKey: 'your-api-key',
      urls: { authentication: 'https://auth.yourapp.com' },
    }),
  ],
})
export class AppModule {}
```

## Available Services

| Service | Sub-services |
|---------|-------------|
| `AuthenticationService` | auth, users, roles, permissions, apiKeys, mfa, oauth, avatars, tenants, apps, blocks, services, subscriptionModels, userSubscriptions, companySubscriptions, countries, states, counties, cities, currencies, guests, magicLinks, refreshTokens, userDevices, tenantUsers, mailTemplates, jwks, adminRsaKeys, oidc |
| `SearchService` | search, history, favorites, entities, identities, jarvis |
| `ProductsService` | products, cart, cartDetails, categories, brands, vendors, warehouses, channels, collections, productSets, shoppingLists, promotions, prices, filters, images, variations, reviews, variationReviews, stock, suggestions, addons, myCarts, remarketing, visitors, productVendors |
| `CrmService` | accounts, contacts, contactEvents, leads, leadFollows, opportunities, meetings, meetingParticipants, meetingBillings, quotes, subscribers, referrals, touches, categories, calendarAccounts, busyBlocks, icsTokens, zoomMeetings, zoomHosts, mailTemplates, communications, users, billingReports, calendarSync |
| `ContentService` | posts, postVersions, postTemplates, comments, categories, tags, users, moderation, activity, series |
| `GeolocationService` | locations, addresses, areas, regions, routes, bookings, premises, premiseEvents, routeTracker, locationHours, locationImages, locationSlots, locationTaxes, locationGroups, identities, locationIdentities, geoCountries, geoStates, geoCities |
| `ConversationsService` | messages, draftMessages, groups, groupInvites, notifications, conversations, websocketTokens, contexts, notificationSettings, availabilities, messageFiles, sources, users, meetings, webNotifications |
| `FilesService` | storageFiles, entityFiles, fileSchemas, userFiles, fileCategories, fileTags, delegations, fileAccess, fileAccessRequests |
| `FormsService` | forms, schemas, schemaVersions, instances, sets, landings, subscriptions, appointments, surveys, referrals, mailTemplates, applicationForms, crmSync |
| `AssetsService` | assets, events, audits, categories, tags, vendors, warehouses, entities, operations, alerts, users, images |
| `CampaignsService` | campaigns, campaignMedia, landingPages, audiences, landingTemplates, targets, results, markets, locations, templates, mediaResults, media |
| `CompanyService` | companies, departments, teams, teamMembers, quarters, positions, employeeAssignments |
| `RewardsService` | rewards, coupons, loyalty, badges, couponConfigurations, offerCodes, expirationRules, customers, badgeCategories, moneyRules, productRules, eventRules |
| `SalesService` | orders, orderDetails, orderTaxes, payments, subscriptions, subscriptionModels, entities, users, customers, flexibleOrders, stripe, mercadopago, vendorPayments |
| `WalletService` | wallets, transactions, authorizationCodes, webhooks |
| `JarvisService` | agents, prompts, workflows, executions, conversations, aiModels, entities, clusters, users, workflowParticipants, workflowSteps, workflowInstances, agentRuntime, mailTemplates, marvinChat, promptComments, executionComments |
| `OnboardingService` | onboardings, flows, userJourneys, userIdentities, onboard, mailTemplates, remarketing |
| `UniversityService` | courses, lessons, enrollments, assignments, submissions, subjects, teachers, students, courseGroups, coachingSessions, tests, registrationTokens, placements, calendars, matches, attendance, notes |

Each service also exposes a `{serviceName}Block` getter for full block access.

## Usage Examples

### Authentication

```typescript
import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@23blocks/angular';

@Component({ ... })
export class AuthComponent {
  private auth = inject(AuthenticationService);

  // Sign in (Observable with token management)
  signIn() {
    this.auth.signIn({ email: this.email, password: this.password }).subscribe({
      next: ({ user, accessToken }) => console.log('Welcome', user.email),
    });
  }

  // Sign up (Observable with token management)
  signUp() {
    this.auth.signUp({
      email: 'new@example.com',
      password: 'password',
      passwordConfirmation: 'password',
    }).subscribe();
  }

  // Sign out (Observable with token management)
  signOut() {
    this.auth.signOut().subscribe();
  }

  // Check if authenticated
  isAuthenticated(): boolean | null {
    return this.auth.isAuthenticated();
  }

  // Access sub-services (Promise-based)
  async loadUser(id: string) {
    return await this.auth.users.get(id);
  }

  async listRoles() {
    return await this.auth.roles.list();
  }
}
```

### Search

```typescript
import { Component, inject } from '@angular/core';
import { SearchService } from '@23blocks/angular';
import { Subject, debounceTime, switchMap, from } from 'rxjs';

@Component({
  selector: 'app-search',
  template: `
    <input (input)="onSearch($event)" placeholder="Search..." />
    <ul>
      <li *ngFor="let result of results">{{ result.title }}</li>
    </ul>
  `,
})
export class SearchComponent {
  private searchSvc = inject(SearchService);
  private searchSubject = new Subject<string>();
  results: any[] = [];

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap((query) => from(this.searchSvc.search.search({ query, limit: 10 })))
    ).subscribe({
      next: (response) => this.results = response.results,
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }
}
```

### Products

```typescript
import { Component, inject } from '@angular/core';
import { ProductsService } from '@23blocks/angular';
import { from } from 'rxjs';

@Component({ ... })
export class ProductsComponent {
  private products = inject(ProductsService);

  // Promise-based
  async loadProducts() {
    return await this.products.products.list({ page: 1, perPage: 20 });
  }

  // Observable-based
  products$ = from(this.products.products.list({ page: 1, perPage: 20 }));

  async addToCart(productId: string) {
    await this.products.cart.addItem({ productId, quantity: 1 });
  }
}
```

### Content

```typescript
import { Component, inject } from '@angular/core';
import { ContentService } from '@23blocks/angular';

@Component({ ... })
export class BlogComponent {
  private content = inject(ContentService);

  async loadPosts() {
    return await this.content.posts.list({ page: 1, perPage: 10 });
  }

  async createPost() {
    return await this.content.posts.create({
      title: 'My New Post',
      body: 'Post content here...',
      status: 'published',
    });
  }

  async loadSeries() {
    return await this.content.series.list({ page: 1, perPage: 10 });
  }
}
```

### CRM

```typescript
import { Component, inject } from '@angular/core';
import { CrmService } from '@23blocks/angular';

@Component({ ... })
export class CrmComponent {
  private crm = inject(CrmService);

  async loadContacts() {
    return await this.crm.contacts.list({ page: 1, perPage: 20 });
  }

  async createLead() {
    return await this.crm.leads.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });
  }
}
```

## RxJS Patterns

Since sub-services return Promises, use `from()` to work with Observables:

```typescript
import { from, forkJoin } from 'rxjs';

// Convert a single Promise
from(this.products.products.list()).subscribe(list => { ... });

// Combine multiple calls
forkJoin({
  products: from(this.products.products.list()),
  categories: from(this.products.categories.list()),
}).subscribe(({ products, categories }) => { ... });

// Use with RxJS operators
from(this.search.search.search({ query })).pipe(
  map(result => result.data),
  catchError(err => of([]))
).subscribe(results => { ... });
```

### Caching with shareReplay

```typescript
import { from, shareReplay } from 'rxjs';

// Cache categories
categories$ = from(this.products.categories.list()).pipe(
  shareReplay(1)
);
```

## Error Handling

Every error includes a unique request ID for debugging:

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

this.auth.signIn({ email, password }).subscribe({
  error: (err) => {
    if (isBlockErrorException(err)) {
      console.log('Request ID:', err.requestId);  // "req_m5abc_xyz123"
      console.log('Duration:', err.duration);      // 145 (ms)

      switch (err.code) {
        case ErrorCodes.INVALID_CREDENTIALS:
          this.error = 'Invalid email or password';
          break;
        case ErrorCodes.UNAUTHORIZED:
          this.error = 'Session expired';
          break;
        default:
          this.error = err.message;
      }
    }
  },
});
```

## Advanced Setup (Custom Transport)

For advanced use cases requiring custom transport configuration:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provide23Blocks } from '@23blocks/angular';
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://auth.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return {
      'x-api-key': 'your-api-key',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provide23Blocks({
      transport,
      authentication: { apiKey: 'your-api-key' },
      search: { apiKey: 'your-api-key' },
      products: { apiKey: 'your-api-key' },
    }),
  ],
};
```

## Testing

Mock services in your tests:

```typescript
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '@23blocks/angular';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  const mockAuth = {
    // Auth-flow methods return Observables
    signIn: jest.fn().mockReturnValue(of({
      user: { email: 'test@test.com' },
      accessToken: 'token',
    })),
    // Sub-service getters return objects with Promise methods
    users: {
      get: jest.fn().mockResolvedValue({ email: 'test@test.com' }),
      list: jest.fn().mockResolvedValue({ data: [] }),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationService, useValue: mockAuth },
      ],
    });
  });
});
```

## TypeScript

All services are fully typed. Import types from block packages:

```typescript
import type { User, SignInResponse, SignUpResponse } from '@23blocks/block-authentication';
import type { Product } from '@23blocks/block-products';
import type { Contact, Lead } from '@23blocks/block-crm';
import type { Post, Series } from '@23blocks/block-content';
```

## Environment Variables

```typescript
// environment.ts
export const environment = {
  production: false,
  apiKey: 'your-api-key',
  urls: {
    authentication: 'https://auth.yourapp.com',
    products: 'https://products.yourapp.com',
  },
};

// app.config.ts
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlocks23({
      apiKey: environment.apiKey,
      urls: environment.urls,
    }),
  ],
};
```

## Related Packages

- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration

## License

MIT - Copyright (c) 2024 23blocks
