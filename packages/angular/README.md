# @23blocks/angular

Angular bindings for the 23blocks SDK - Injectable services with RxJS Observables.

[![npm version](https://img.shields.io/npm/v/@23blocks/angular.svg)](https://www.npmjs.com/package/@23blocks/angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/angular
```

## Overview

This package provides Angular-specific bindings for the 23blocks SDK:

- **Injectable Services** - All blocks exposed as Angular services
- **RxJS Observables** - All methods return Observables
- **Token Management** - Automatic token storage and refresh
- **Dependency Injection** - Full DI support with providers

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

### Token Mode (Default)

```typescript
provideBlocks23({
  apiKey: 'your-api-key',
  urls: { authentication: 'https://auth.yourapp.com' },
  authMode: 'token',        // default
  storage: 'localStorage',  // default
})
```

### Cookie Mode (Recommended for Security)

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

| Service | Description |
|---------|-------------|
| `AuthenticationService` | Sign in, sign up, password reset, MFA |
| `SearchService` | Full-text search, favorites |
| `ProductsService` | Products, categories, variants, cart |
| `CrmService` | Contacts, accounts, leads, opportunities |
| `ContentService` | Posts, comments, categories, tags |
| `GeolocationService` | Addresses, locations, areas |
| `ConversationsService` | Messages, groups, notifications |
| `FilesService` | File uploads, storage |
| `FormsService` | Form builder, submissions |
| `AssetsService` | Asset management, tracking |
| `CampaignsService` | Marketing campaigns, audiences |
| `CompanyService` | Company settings, departments, teams |
| `RewardsService` | Rewards, coupons, loyalty, badges |
| `SalesService` | Orders, payments, subscriptions |
| `WalletService` | Digital wallet, transactions |
| `JarvisService` | AI assistant, prompts, workflows |
| `OnboardingService` | User onboarding flows |
| `UniversityService` | Courses, lessons, enrollments |

## Authentication Examples

### Sign In

```typescript
import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@23blocks/angular';

@Component({ ... })
export class LoginComponent {
  private auth = inject(AuthenticationService);

  email = '';
  password = '';

  signIn() {
    // Required: email, password
    this.auth.signIn({ email: this.email, password: this.password }).subscribe({
      next: ({ user, accessToken, refreshToken, expiresIn }) => {
        console.log('Welcome', user.email);
        // In token mode, tokens are automatically stored
      },
      error: (err) => {
        console.error('Login failed:', err.message);
      },
    });
  }
}
```

### Sign Up (Registration)

```typescript
@Component({ ... })
export class RegisterComponent {
  private auth = inject(AuthenticationService);

  // Sign up with required fields only
  signUp() {
    this.auth.signUp({
      email: 'new@example.com',         // Required
      password: 'password',              // Required
      passwordConfirmation: 'password',  // Required - must match password
    }).subscribe({
      next: ({ user, accessToken, message }) => {
        // accessToken may be undefined if email confirmation is enabled
        if (accessToken) {
          console.log('Logged in as', user.email);
        } else {
          console.log(message); // "Confirmation email sent"
        }
      },
    });
  }

  // Sign up with all optional fields
  signUpFull() {
    this.auth.signUp({
      // Required
      email: 'new@example.com',
      password: 'securePassword123',
      passwordConfirmation: 'securePassword123',

      // Optional
      name: 'John Doe',
      username: 'johndoe',
      roleId: 'role-uuid',
      confirmSuccessUrl: 'https://yourapp.com/confirmed',  // Redirect after email confirmation
      timeZone: 'America/New_York',
      preferredLanguage: 'en',
      payload: { referralCode: 'ABC123' },
      subscription: 'premium-plan',
    }).subscribe();
  }
}
```

### Sign Out

```typescript
signOut() {
  this.auth.signOut().subscribe({
    next: () => {
      console.log('Signed out');
      // Tokens are automatically cleared
    },
  });
}
```

### Email Confirmation

```typescript
// Confirm email with token from URL
confirmEmail(token: string) {
  this.auth.confirmEmail(token).subscribe({
    next: (user) => {
      console.log('Email confirmed for', user.email);
    },
  });
}

// Resend confirmation email
resendConfirmation(email: string) {
  this.auth.resendConfirmation({
    email,
    confirmSuccessUrl: 'https://yourapp.com/confirmed',  // Optional
  }).subscribe({
    next: () => {
      console.log('Confirmation email sent');
    },
  });
}
```

### Get Current User

```typescript
// Returns user with role, avatar, and profile included
getCurrentUser() {
  return this.auth.getCurrentUser();
}
```

### Check Authentication

```typescript
// Token mode: returns true/false
// Cookie mode: returns null (use validateToken instead)
isAuthenticated(): boolean | null {
  return this.auth.isAuthenticated();
}
```

### Full AuthenticationService Example

```typescript
import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@23blocks/angular';

@Component({ ... })
export class AuthComponent {
  private auth = inject(AuthenticationService);

  // Sign in
  signIn() {
    this.auth.signIn({ email, password }).subscribe({
      next: ({ user, accessToken }) => console.log('Welcome', user.email),
    });
  }

  // Sign up
  signUp() {
    this.auth.signUp({
      email: 'new@example.com',
      password: 'password',
      passwordConfirmation: 'password',
    }).subscribe();
  }

  // Sign out
  signOut() {
    this.auth.signOut().subscribe();
  }

  // Check if authenticated
  isAuthenticated(): boolean | null {
    return this.auth.isAuthenticated();
  }

  // Get current user
  getCurrentUser() {
    return this.auth.getCurrentUser();
  }
}
```

## SearchService Example

```typescript
import { Component, inject } from '@angular/core';
import { SearchService } from '@23blocks/angular';
import { Subject, debounceTime, switchMap } from 'rxjs';

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
  private search = inject(SearchService);
  private searchSubject = new Subject<string>();
  results: any[] = [];

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap((query) => this.search.search({ query, limit: 10 }))
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

## ProductsService Example

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '@23blocks/angular';

@Component({ ... })
export class ProductsComponent implements OnInit {
  private products = inject(ProductsService);
  productList$ = this.products.list({ limit: 20 });

  addToCart(productId: string) {
    this.products.addToCart({ productId, quantity: 1 }).subscribe();
  }
}
```

## RxJS Patterns

### Combining Multiple Services

```typescript
import { forkJoin } from 'rxjs';

// Fetch user and favorites in parallel
forkJoin({
  user: this.auth.getCurrentUser(),
  favorites: this.search.listFavorites({ limit: 10 }),
}).subscribe({
  next: ({ user, favorites }) => {
    console.log(user, favorites);
  },
});
```

### Caching with shareReplay

```typescript
import { shareReplay } from 'rxjs';

// Cache the current user
currentUser$ = this.auth.getCurrentUser().pipe(
  shareReplay(1)
);
```

### Error Handling

Every error includes a unique request ID for easy debugging and support:

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

this.auth.signIn({ email, password }).subscribe({
  error: (err) => {
    if (isBlockErrorException(err)) {
      // Request tracing for debugging
      console.log('Request ID:', err.requestId);  // "req_m5abc_xyz123"
      console.log('Duration:', err.duration);      // 145 (ms)

      switch (err.code) {
        case ErrorCodes.INVALID_CREDENTIALS:
          this.error = 'Invalid email or password';
          break;
        case ErrorCodes.UNAUTHORIZED:
          this.error = 'Session expired';
          break;
        case ErrorCodes.VALIDATION_ERROR:
          this.error = err.message;
          break;
        default:
          this.error = err.message;
      }

      // Send request ID to support for debugging
      // "Please check request req_m5abc_xyz123"
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
    signIn: jest.fn().mockReturnValue(of({
      user: { email: 'test@test.com' },
      accessToken: 'token',
    })),
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

## TypeScript

All services are fully typed:

```typescript
import type { User, SignInResponse, SignUpResponse } from '@23blocks/block-authentication';

// SignInResponse
interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
}

// SignUpResponse - accessToken is optional (email confirmation)
interface SignUpResponse {
  user: User;
  accessToken?: string;  // undefined if email confirmation enabled
  message?: string;
}
```

## Related Packages

- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration

## License

MIT - Copyright (c) 2024 23blocks
