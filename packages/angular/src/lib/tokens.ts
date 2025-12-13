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

/**
 * Injection token for the Transport instance
 */
export const TRANSPORT = new InjectionToken<Transport>('23blocks.transport');

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
