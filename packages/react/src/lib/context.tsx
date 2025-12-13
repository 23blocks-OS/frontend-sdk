import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Transport } from '@23blocks/contracts';
import {
  createAuthenticationBlock,
  type AuthenticationBlock,
  type AuthenticationBlockConfig,
} from '@23blocks/block-authentication';
import {
  createSearchBlock,
  type SearchBlock,
  type SearchBlockConfig,
} from '@23blocks/block-search';

// ─────────────────────────────────────────────────────────────────────────────
// Context Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Blocks23Context {
  transport: Transport;
  authentication: AuthenticationBlock | null;
  search: SearchBlock | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const Blocks23ContextInternal = createContext<Blocks23Context | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Props
// ─────────────────────────────────────────────────────────────────────────────

export interface Blocks23ProviderProps {
  children: ReactNode;

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

// ─────────────────────────────────────────────────────────────────────────────
// Provider Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Provider component for 23blocks services.
 *
 * @example
 * ```tsx
 * import { Blocks23Provider } from '@23blocks/react';
 * import { createHttpTransport } from '@23blocks/transport-http';
 *
 * const transport = createHttpTransport({
 *   baseUrl: 'https://api.example.com',
 *   headers: () => ({
 *     'Authorization': `Bearer ${localStorage.getItem('token')}`,
 *   }),
 * });
 *
 * function App() {
 *   return (
 *     <Blocks23Provider
 *       transport={transport}
 *       authentication={{ appId: 'my-app' }}
 *       search={{ appId: 'my-app' }}
 *     >
 *       <MyApp />
 *     </Blocks23Provider>
 *   );
 * }
 * ```
 */
export function Blocks23Provider({
  children,
  transport,
  authentication,
  search,
}: Blocks23ProviderProps) {
  const value = useMemo<Blocks23Context>(() => ({
    transport,
    authentication: authentication
      ? createAuthenticationBlock(transport, authentication)
      : null,
    search: search
      ? createSearchBlock(transport, search)
      : null,
  }), [transport, authentication, search]);

  return (
    <Blocks23ContextInternal.Provider value={value}>
      {children}
    </Blocks23ContextInternal.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Context Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to access the 23blocks context.
 * Use this for low-level access to blocks.
 */
export function use23Blocks(): Blocks23Context {
  const context = useContext(Blocks23ContextInternal);
  if (!context) {
    throw new Error('use23Blocks must be used within a Blocks23Provider');
  }
  return context;
}

/**
 * Hook to access the Authentication block.
 * Throws if authentication was not configured in the provider.
 */
export function useAuthenticationBlock(): AuthenticationBlock {
  const { authentication } = use23Blocks();
  if (!authentication) {
    throw new Error(
      'Authentication block not configured. Pass `authentication` prop to Blocks23Provider.'
    );
  }
  return authentication;
}

/**
 * Hook to access the Search block.
 * Throws if search was not configured in the provider.
 */
export function useSearchBlock(): SearchBlock {
  const { search } = use23Blocks();
  if (!search) {
    throw new Error(
      'Search block not configured. Pass `search` prop to Blocks23Provider.'
    );
  }
  return search;
}
