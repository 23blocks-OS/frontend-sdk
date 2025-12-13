import { InjectionToken } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import type { AuthenticationBlockConfig } from '@23blocks/block-authentication';
import type { SearchBlockConfig } from '@23blocks/block-search';

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
