import type { Provider, EnvironmentProviders } from '@angular/core';
import { makeEnvironmentProviders } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import type { AuthenticationBlockConfig } from '@23blocks/block-authentication';
import type { SearchBlockConfig } from '@23blocks/block-search';
import { TRANSPORT, AUTHENTICATION_CONFIG, SEARCH_CONFIG } from './tokens.js';

/**
 * Configuration for providing 23blocks services
 */
export interface Provide23BlocksConfig {
  /**
   * The transport instance (e.g., from createHttpTransport)
   */
  transport: Transport;

  /**
   * Authentication block configuration (optional)
   */
  authentication?: AuthenticationBlockConfig;

  /**
   * Search block configuration (optional)
   */
  search?: SearchBlockConfig;
}

/**
 * Provide 23blocks services for standalone Angular applications.
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { ApplicationConfig } from '@angular/core';
 * import { provide23Blocks } from '@23blocks/angular';
 * import { createHttpTransport } from '@23blocks/transport-http';
 *
 * const transport = createHttpTransport({
 *   baseUrl: 'https://api.example.com',
 *   headers: () => ({
 *     'Authorization': `Bearer ${localStorage.getItem('token')}`,
 *   }),
 * });
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provide23Blocks({
 *       transport,
 *       authentication: { appId: 'my-app' },
 *       search: { appId: 'my-app' },
 *     }),
 *   ],
 * };
 * ```
 */
export function provide23Blocks(config: Provide23BlocksConfig): EnvironmentProviders {
  const providers: Provider[] = [
    { provide: TRANSPORT, useValue: config.transport },
  ];

  if (config.authentication) {
    providers.push({
      provide: AUTHENTICATION_CONFIG,
      useValue: config.authentication,
    });
  }

  if (config.search) {
    providers.push({
      provide: SEARCH_CONFIG,
      useValue: config.search,
    });
  }

  return makeEnvironmentProviders(providers);
}

/**
 * Get providers array for NgModule-based applications.
 *
 * @example
 * ```typescript
 * // app.module.ts
 * import { NgModule } from '@angular/core';
 * import { get23BlocksProviders } from '@23blocks/angular';
 *
 * @NgModule({
 *   providers: [
 *     ...get23BlocksProviders({
 *       transport,
 *       authentication: { appId: 'my-app' },
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export function get23BlocksProviders(config: Provide23BlocksConfig): Provider[] {
  const providers: Provider[] = [
    { provide: TRANSPORT, useValue: config.transport },
  ];

  if (config.authentication) {
    providers.push({
      provide: AUTHENTICATION_CONFIG,
      useValue: config.authentication,
    });
  }

  if (config.search) {
    providers.push({
      provide: SEARCH_CONFIG,
      useValue: config.search,
    });
  }

  return providers;
}
