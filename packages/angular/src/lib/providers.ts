import type { Provider, EnvironmentProviders } from '@angular/core';
import { makeEnvironmentProviders } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import type { AuthenticationBlockConfig } from '@23blocks/block-authentication';
import type { SearchBlockConfig } from '@23blocks/block-search';
import type { ProductsBlockConfig } from '@23blocks/block-products';
import type { CrmBlockConfig } from '@23blocks/block-crm';
import type { ContentBlockConfig } from '@23blocks/block-content';
import type { GeolocationBlockConfig } from '@23blocks/block-geolocation';
import type { ConversationsBlockConfig } from '@23blocks/block-conversations';
import type { FilesBlockConfig } from '@23blocks/block-files';
import type { FormsBlockConfig } from '@23blocks/block-forms';
import type { AssetsBlockConfig } from '@23blocks/block-assets';
import type { CampaignsBlockConfig } from '@23blocks/block-campaigns';
import type { CompanyBlockConfig } from '@23blocks/block-company';
import type { RewardsBlockConfig } from '@23blocks/block-rewards';
import type { SalesBlockConfig } from '@23blocks/block-sales';
import type { WalletBlockConfig } from '@23blocks/block-wallet';
import type { JarvisBlockConfig } from '@23blocks/block-jarvis';
import type { OnboardingBlockConfig } from '@23blocks/block-onboarding';
import type { UniversityBlockConfig } from '@23blocks/block-university';
import {
  TRANSPORT,
  AUTHENTICATION_CONFIG,
  SEARCH_CONFIG,
  PRODUCTS_CONFIG,
  CRM_CONFIG,
  CONTENT_CONFIG,
  GEOLOCATION_CONFIG,
  CONVERSATIONS_CONFIG,
  FILES_CONFIG,
  FORMS_CONFIG,
  ASSETS_CONFIG,
  CAMPAIGNS_CONFIG,
  COMPANY_CONFIG,
  REWARDS_CONFIG,
  SALES_CONFIG,
  WALLET_CONFIG,
  JARVIS_CONFIG,
  ONBOARDING_CONFIG,
  UNIVERSITY_CONFIG,
} from './tokens.js';

/**
 * Configuration for providing 23blocks services
 */
export interface Provide23BlocksConfig {
  transport: Transport;
  authentication?: AuthenticationBlockConfig;
  search?: SearchBlockConfig;
  products?: ProductsBlockConfig;
  crm?: CrmBlockConfig;
  content?: ContentBlockConfig;
  geolocation?: GeolocationBlockConfig;
  conversations?: ConversationsBlockConfig;
  files?: FilesBlockConfig;
  forms?: FormsBlockConfig;
  assets?: AssetsBlockConfig;
  campaigns?: CampaignsBlockConfig;
  company?: CompanyBlockConfig;
  rewards?: RewardsBlockConfig;
  sales?: SalesBlockConfig;
  wallet?: WalletBlockConfig;
  jarvis?: JarvisBlockConfig;
  onboarding?: OnboardingBlockConfig;
  university?: UniversityBlockConfig;
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
 *       authentication: { apiKey: 'my-api-key' },
 *       search: { apiKey: 'my-api-key' },
 *       products: { apiKey: 'my-api-key' },
 *       crm: { apiKey: 'my-api-key' },
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
    providers.push({ provide: AUTHENTICATION_CONFIG, useValue: config.authentication });
  }
  if (config.search) {
    providers.push({ provide: SEARCH_CONFIG, useValue: config.search });
  }
  if (config.products) {
    providers.push({ provide: PRODUCTS_CONFIG, useValue: config.products });
  }
  if (config.crm) {
    providers.push({ provide: CRM_CONFIG, useValue: config.crm });
  }
  if (config.content) {
    providers.push({ provide: CONTENT_CONFIG, useValue: config.content });
  }
  if (config.geolocation) {
    providers.push({ provide: GEOLOCATION_CONFIG, useValue: config.geolocation });
  }
  if (config.conversations) {
    providers.push({ provide: CONVERSATIONS_CONFIG, useValue: config.conversations });
  }
  if (config.files) {
    providers.push({ provide: FILES_CONFIG, useValue: config.files });
  }
  if (config.forms) {
    providers.push({ provide: FORMS_CONFIG, useValue: config.forms });
  }
  if (config.assets) {
    providers.push({ provide: ASSETS_CONFIG, useValue: config.assets });
  }
  if (config.campaigns) {
    providers.push({ provide: CAMPAIGNS_CONFIG, useValue: config.campaigns });
  }
  if (config.company) {
    providers.push({ provide: COMPANY_CONFIG, useValue: config.company });
  }
  if (config.rewards) {
    providers.push({ provide: REWARDS_CONFIG, useValue: config.rewards });
  }
  if (config.sales) {
    providers.push({ provide: SALES_CONFIG, useValue: config.sales });
  }
  if (config.wallet) {
    providers.push({ provide: WALLET_CONFIG, useValue: config.wallet });
  }
  if (config.jarvis) {
    providers.push({ provide: JARVIS_CONFIG, useValue: config.jarvis });
  }
  if (config.onboarding) {
    providers.push({ provide: ONBOARDING_CONFIG, useValue: config.onboarding });
  }
  if (config.university) {
    providers.push({ provide: UNIVERSITY_CONFIG, useValue: config.university });
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
 *       authentication: { apiKey: 'my-api-key' },
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
    providers.push({ provide: AUTHENTICATION_CONFIG, useValue: config.authentication });
  }
  if (config.search) {
    providers.push({ provide: SEARCH_CONFIG, useValue: config.search });
  }
  if (config.products) {
    providers.push({ provide: PRODUCTS_CONFIG, useValue: config.products });
  }
  if (config.crm) {
    providers.push({ provide: CRM_CONFIG, useValue: config.crm });
  }
  if (config.content) {
    providers.push({ provide: CONTENT_CONFIG, useValue: config.content });
  }
  if (config.geolocation) {
    providers.push({ provide: GEOLOCATION_CONFIG, useValue: config.geolocation });
  }
  if (config.conversations) {
    providers.push({ provide: CONVERSATIONS_CONFIG, useValue: config.conversations });
  }
  if (config.files) {
    providers.push({ provide: FILES_CONFIG, useValue: config.files });
  }
  if (config.forms) {
    providers.push({ provide: FORMS_CONFIG, useValue: config.forms });
  }
  if (config.assets) {
    providers.push({ provide: ASSETS_CONFIG, useValue: config.assets });
  }
  if (config.campaigns) {
    providers.push({ provide: CAMPAIGNS_CONFIG, useValue: config.campaigns });
  }
  if (config.company) {
    providers.push({ provide: COMPANY_CONFIG, useValue: config.company });
  }
  if (config.rewards) {
    providers.push({ provide: REWARDS_CONFIG, useValue: config.rewards });
  }
  if (config.sales) {
    providers.push({ provide: SALES_CONFIG, useValue: config.sales });
  }
  if (config.wallet) {
    providers.push({ provide: WALLET_CONFIG, useValue: config.wallet });
  }
  if (config.jarvis) {
    providers.push({ provide: JARVIS_CONFIG, useValue: config.jarvis });
  }
  if (config.onboarding) {
    providers.push({ provide: ONBOARDING_CONFIG, useValue: config.onboarding });
  }
  if (config.university) {
    providers.push({ provide: UNIVERSITY_CONFIG, useValue: config.university });
  }

  return providers;
}
