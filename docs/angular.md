# Angular Guide

Setup and usage guide for Angular applications using `@23blocks/angular`.

## Installation

```bash
npm install @23blocks/angular
```

## Quick Start (Recommended)

The simplest way to use the SDK with automatic token management:

### 1. Configure providers

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideBlocks23 } from '@23blocks/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBlocks23({
      baseUrl: 'https://api.yourapp.com',
      appId: 'your-app-id',
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
      <p *ngIf="error" class="error">{{ error }}</p>
    </form>
  `,
})
export class LoginComponent {
  private auth = inject(AuthenticationService);

  email = '';
  password = '';
  loading = false;
  error = '';

  login() {
    this.loading = true;
    this.error = '';

    // Tokens are stored automatically!
    this.auth.signIn({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Welcome', response.user.email);
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  logout() {
    // Tokens are cleared automatically!
    this.auth.signOut().subscribe();
  }

  checkAuth() {
    // Check if user is authenticated (token mode only)
    return this.auth.isAuthenticated();
  }
}
```

## Configuration Options

### Token Mode (Default)

```typescript
provideBlocks23({
  baseUrl: 'https://api.yourapp.com',
  appId: 'your-app-id',
  // authMode: 'token', // default
  // storage: 'localStorage', // 'sessionStorage' | 'memory'
})
```

### Cookie Mode (Recommended for Security)

```typescript
provideBlocks23({
  baseUrl: 'https://api.yourapp.com',
  appId: 'your-app-id',
  authMode: 'cookie',
})
```

### Multi-Tenant Setup

```typescript
provideBlocks23({
  baseUrl: 'https://api.yourapp.com',
  appId: 'your-app-id',
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
      baseUrl: 'https://api.yourapp.com',
      appId: 'your-app-id',
    }),
  ],
})
export class AppModule {}
```

---

## Advanced Setup (Custom Transport)

For advanced use cases requiring custom transport configuration:

```bash
npm install @23blocks/transport-http @23blocks/angular @23blocks/block-authentication
```

### 1. Configure providers

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provide23Blocks } from '@23blocks/angular';
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provide23Blocks({
      transport,
      authentication: { appId: 'your-app-id' },
      search: { appId: 'your-app-id' },
      // Add more blocks as needed
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

## Using Services (Advanced API)

### AuthenticationService

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
      <p *ngIf="error" class="error">{{ error }}</p>
    </form>
  `,
})
export class LoginComponent {
  private auth = inject(AuthenticationService);

  email = '';
  password = '';
  loading = false;
  error = '';

  login() {
    this.loading = true;
    this.error = '';

    this.auth.signIn({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.accessToken);
          console.log('Welcome', response.user.email);
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
```

### SearchService

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
      next: (response) => {
        this.results = response.data;
      },
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }
}
```

### ProductsService

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '@23blocks/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  template: `
    <div *ngFor="let product of products$ | async">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency }}</p>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  private products = inject(ProductsService);
  products$!: Observable<any[]>;

  ngOnInit() {
    this.products$ = this.products.listProducts({ limit: 20 }).pipe(
      map(response => response.data)
    );
  }
}
```

## Available Services

| Service | Block | Description |
|---------|-------|-------------|
| `AuthenticationService` | authentication | Sign in, sign up, password reset, MFA |
| `SearchService` | search | Full-text search, favorites |
| `ProductsService` | products | Products, categories, variants |
| `CrmService` | crm | Contacts, organizations, deals |
| `ContentService` | content | CMS content, pages |
| `GeolocationService` | geolocation | Addresses, places, geocoding |
| `ConversationsService` | conversations | Messages, threads |
| `FilesService` | files | File uploads |
| `FormsService` | forms | Form builder, submissions |
| `AssetsService` | assets | Asset management |
| `CampaignsService` | campaigns | Marketing campaigns |
| `CompanyService` | company | Company settings |
| `RewardsService` | rewards | Loyalty programs |
| `SalesService` | sales | Orders, invoices |
| `WalletService` | wallet | Digital wallet |
| `JarvisService` | jarvis | AI assistant |
| `OnboardingService` | onboarding | User onboarding |
| `UniversityService` | university | Learning management |

## Error Handling

All services return RxJS Observables. Errors are instances of `BlockErrorException`:

```typescript
import { BlockErrorException, isBlockErrorException } from '@23blocks/contracts';

this.auth.signIn({ email, password }).subscribe({
  error: (err) => {
    if (isBlockErrorException(err)) {
      // Typed error with code, message, details
      console.log(err.code);    // e.g., 'INVALID_CREDENTIALS'
      console.log(err.message); // e.g., 'Invalid email or password'
    }
  },
});
```

## RxJS Patterns

### Combining Multiple Blocks

```typescript
import { forkJoin } from 'rxjs';

// Fetch user and their favorites in parallel
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

## Lazy Loading Modules

For lazy-loaded modules, you can provide block configs at the module level:

```typescript
// feature.module.ts
import { NgModule } from '@angular/core';
import { provide23Blocks } from '@23blocks/angular';

@NgModule({
  providers: [
    provide23Blocks({
      transport: existingTransport,
      products: { appId: 'feature-specific-app-id' },
    }),
  ],
})
export class FeatureModule {}
```

## Testing

Mock services in your tests:

```typescript
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '@23blocks/angular';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  const mockAuth = {
    signIn: jest.fn().mockReturnValue(of({ user: { email: 'test@test.com' }, accessToken: 'token' })),
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
