import { InjectionToken } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import type { AuthenticationBlockConfig } from '@23blocks/block-authentication';
import type { SearchBlockConfig } from '@23blocks/block-search';
import type { GeolocationBlockConfig } from '@23blocks/block-geolocation';
import type { ContentBlockConfig } from '@23blocks/block-content';
import type { CrmBlockConfig } from '@23blocks/block-crm';
import type { ProductsBlockConfig } from '@23blocks/block-products';
import type { ConversationsBlockConfig } from '@23blocks/block-conversations';
import type { FilesBlockConfig } from '@23blocks/block-files';
import type { AssetsBlockConfig } from '@23blocks/block-assets';
import type { FormsBlockConfig } from '@23blocks/block-forms';
import type { SalesBlockConfig } from '@23blocks/block-sales';
import type { CampaignsBlockConfig } from '@23blocks/block-campaigns';
import type { CompanyBlockConfig } from '@23blocks/block-company';
import type { RewardsBlockConfig } from '@23blocks/block-rewards';
import type { JarvisBlockConfig } from '@23blocks/block-jarvis';
import type { OnboardingBlockConfig } from '@23blocks/block-onboarding';
import type { UniversityBlockConfig } from '@23blocks/block-university';
import type { WalletBlockConfig } from '@23blocks/block-wallet';

// ─────────────────────────────────────────────────────────────────────────────
// Transport Tokens (per-service)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use per-service transport tokens (AUTHENTICATION_TRANSPORT, etc.)
 * Shared transport token - only for backward compatibility with advanced API
 */
export const TRANSPORT = new InjectionToken<Transport>('23blocks.transport');

/** Transport for Authentication service */
export const AUTHENTICATION_TRANSPORT = new InjectionToken<Transport | null>('23blocks.authentication.transport');

/** Transport for Search service */
export const SEARCH_TRANSPORT = new InjectionToken<Transport | null>('23blocks.search.transport');

/** Transport for Products service */
export const PRODUCTS_TRANSPORT = new InjectionToken<Transport | null>('23blocks.products.transport');

/** Transport for CRM service */
export const CRM_TRANSPORT = new InjectionToken<Transport | null>('23blocks.crm.transport');

/** Transport for Content service */
export const CONTENT_TRANSPORT = new InjectionToken<Transport | null>('23blocks.content.transport');

/** Transport for Geolocation service */
export const GEOLOCATION_TRANSPORT = new InjectionToken<Transport | null>('23blocks.geolocation.transport');

/** Transport for Conversations service */
export const CONVERSATIONS_TRANSPORT = new InjectionToken<Transport | null>('23blocks.conversations.transport');

/** Transport for Files service */
export const FILES_TRANSPORT = new InjectionToken<Transport | null>('23blocks.files.transport');

/** Transport for Forms service */
export const FORMS_TRANSPORT = new InjectionToken<Transport | null>('23blocks.forms.transport');

/** Transport for Assets service */
export const ASSETS_TRANSPORT = new InjectionToken<Transport | null>('23blocks.assets.transport');

/** Transport for Campaigns service */
export const CAMPAIGNS_TRANSPORT = new InjectionToken<Transport | null>('23blocks.campaigns.transport');

/** Transport for Company service */
export const COMPANY_TRANSPORT = new InjectionToken<Transport | null>('23blocks.company.transport');

/** Transport for Rewards service */
export const REWARDS_TRANSPORT = new InjectionToken<Transport | null>('23blocks.rewards.transport');

/** Transport for Sales service */
export const SALES_TRANSPORT = new InjectionToken<Transport | null>('23blocks.sales.transport');

/** Transport for Wallet service */
export const WALLET_TRANSPORT = new InjectionToken<Transport | null>('23blocks.wallet.transport');

/** Transport for Jarvis service */
export const JARVIS_TRANSPORT = new InjectionToken<Transport | null>('23blocks.jarvis.transport');

/** Transport for Onboarding service */
export const ONBOARDING_TRANSPORT = new InjectionToken<Transport | null>('23blocks.onboarding.transport');

/** Transport for University service */
export const UNIVERSITY_TRANSPORT = new InjectionToken<Transport | null>('23blocks.university.transport');

// ─────────────────────────────────────────────────────────────────────────────
// Config Tokens (per-service)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Injection token for Authentication block configuration
 */
export const AUTHENTICATION_CONFIG = new InjectionToken<AuthenticationBlockConfig>(
  '23blocks.authentication.config'
);

/**
 * Injection token for Search block configuration
 */
export const SEARCH_CONFIG = new InjectionToken<SearchBlockConfig>(
  '23blocks.search.config'
);

/**
 * Injection token for Geolocation block configuration
 */
export const GEOLOCATION_CONFIG = new InjectionToken<GeolocationBlockConfig>(
  '23blocks.geolocation.config'
);

/**
 * Injection token for Content block configuration
 */
export const CONTENT_CONFIG = new InjectionToken<ContentBlockConfig>(
  '23blocks.content.config'
);

/**
 * Injection token for CRM block configuration
 */
export const CRM_CONFIG = new InjectionToken<CrmBlockConfig>(
  '23blocks.crm.config'
);

/**
 * Injection token for Products block configuration
 */
export const PRODUCTS_CONFIG = new InjectionToken<ProductsBlockConfig>(
  '23blocks.products.config'
);

/**
 * Injection token for Conversations block configuration
 */
export const CONVERSATIONS_CONFIG = new InjectionToken<ConversationsBlockConfig>(
  '23blocks.conversations.config'
);

/**
 * Injection token for Files block configuration
 */
export const FILES_CONFIG = new InjectionToken<FilesBlockConfig>(
  '23blocks.files.config'
);

/**
 * Injection token for Assets block configuration
 */
export const ASSETS_CONFIG = new InjectionToken<AssetsBlockConfig>(
  '23blocks.assets.config'
);

/**
 * Injection token for Forms block configuration
 */
export const FORMS_CONFIG = new InjectionToken<FormsBlockConfig>(
  '23blocks.forms.config'
);

/**
 * Injection token for Sales block configuration
 */
export const SALES_CONFIG = new InjectionToken<SalesBlockConfig>(
  '23blocks.sales.config'
);

/**
 * Injection token for Campaigns block configuration
 */
export const CAMPAIGNS_CONFIG = new InjectionToken<CampaignsBlockConfig>(
  '23blocks.campaigns.config'
);

/**
 * Injection token for Company block configuration
 */
export const COMPANY_CONFIG = new InjectionToken<CompanyBlockConfig>(
  '23blocks.company.config'
);

/**
 * Injection token for Rewards block configuration
 */
export const REWARDS_CONFIG = new InjectionToken<RewardsBlockConfig>(
  '23blocks.rewards.config'
);

/**
 * Injection token for Jarvis block configuration
 */
export const JARVIS_CONFIG = new InjectionToken<JarvisBlockConfig>(
  '23blocks.jarvis.config'
);

/**
 * Injection token for Onboarding block configuration
 */
export const ONBOARDING_CONFIG = new InjectionToken<OnboardingBlockConfig>(
  '23blocks.onboarding.config'
);

/**
 * Injection token for University block configuration
 */
export const UNIVERSITY_CONFIG = new InjectionToken<UniversityBlockConfig>(
  '23blocks.university.config'
);

/**
 * Injection token for Wallet block configuration
 */
export const WALLET_CONFIG = new InjectionToken<WalletBlockConfig>(
  '23blocks.wallet.config'
);
