/**
 * Test fixtures and factories for common 23blocks responses
 *
 * @example
 * ```typescript
 * import { createMockTransport, fixtures } from '@23blocks/testing';
 *
 * const mock = createMockTransport();
 * mock.onPost('/auth/sign_in').reply(200, fixtures.auth.signInResponse());
 * mock.onGet('/users/me').reply(200, fixtures.auth.currentUserResponse());
 * ```
 */

// ============================================================================
// Utility Functions
// ============================================================================

let idCounter = 1;

/**
 * Generate a unique ID for fixtures
 */
export function generateId(): string {
  return `test-${idCounter++}`;
}

/**
 * Reset the ID counter (useful between tests)
 */
export function resetIdCounter(): void {
  idCounter = 1;
}

/**
 * Generate a random UUID-like string
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get current ISO timestamp
 */
export function timestamp(): string {
  return new Date().toISOString();
}

// ============================================================================
// JSON:API Helpers
// ============================================================================

/**
 * Wrap data in JSON:API format
 */
export function jsonApiResponse<T extends { id?: string; type?: string }>(
  type: string,
  attributes: Omit<T, 'id' | 'type'>,
  id?: string
): { data: { type: string; id: string; attributes: Omit<T, 'id' | 'type'> } } {
  return {
    data: {
      type,
      id: id ?? generateId(),
      attributes,
    },
  };
}

/**
 * Wrap array data in JSON:API format
 */
export function jsonApiListResponse<T extends { id?: string; type?: string }>(
  type: string,
  items: Array<{ id?: string; attributes: Omit<T, 'id' | 'type'> }>,
  meta?: { total?: number; page?: number; perPage?: number }
): {
  data: Array<{ type: string; id: string; attributes: Omit<T, 'id' | 'type'> }>;
  meta?: { total: number; page: number; perPage: number };
} {
  return {
    data: items.map((item) => ({
      type,
      id: item.id ?? generateId(),
      attributes: item.attributes,
    })),
    meta: meta
      ? {
          total: meta.total ?? items.length,
          page: meta.page ?? 1,
          perPage: meta.perPage ?? items.length,
        }
      : undefined,
  };
}

/**
 * Create a JSON:API error response
 */
export function jsonApiError(
  code: string,
  detail: string,
  status: number = 400,
  source?: string
): { errors: Array<{ code: string; detail: string; status: string; source?: { pointer: string } }> } {
  return {
    errors: [
      {
        code,
        detail,
        status: String(status),
        ...(source ? { source: { pointer: source } } : {}),
      },
    ],
  };
}

// ============================================================================
// User Fixtures
// ============================================================================

export interface UserFixture {
  id?: string;
  email?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  status?: 'active' | 'inactive' | 'pending';
  emailConfirmedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create a user fixture
 */
export function createUser(overrides: UserFixture = {}): UserFixture {
  const id = overrides.id ?? generateId();
  return {
    id,
    email: overrides.email ?? `user-${id}@example.com`,
    name: overrides.name ?? `Test User ${id}`,
    username: overrides.username ?? `testuser${id}`,
    avatarUrl: overrides.avatarUrl ?? null,
    status: overrides.status ?? 'active',
    emailConfirmedAt: overrides.emailConfirmedAt ?? timestamp(),
    createdAt: overrides.createdAt ?? timestamp(),
    updatedAt: overrides.updatedAt ?? timestamp(),
    ...overrides,
  };
}

// ============================================================================
// Authentication Fixtures
// ============================================================================

export const auth = {
  /**
   * Create a sign-in response
   */
  signInResponse(userOverrides: UserFixture = {}) {
    const user = createUser(userOverrides);
    return {
      data: {
        type: 'session',
        id: generateId(),
        attributes: {
          accessToken: `test-access-token-${uuid()}`,
          refreshToken: `test-refresh-token-${uuid()}`,
          tokenType: 'Bearer',
          expiresIn: 3600,
        },
        relationships: {
          user: {
            data: { type: 'user', id: user.id },
          },
        },
      },
      included: [
        {
          type: 'user',
          id: user.id,
          attributes: user,
        },
      ],
    };
  },

  /**
   * Create a sign-up response
   */
  signUpResponse(userOverrides: UserFixture = {}, options: { requiresConfirmation?: boolean } = {}) {
    const user = createUser({
      ...userOverrides,
      emailConfirmedAt: options.requiresConfirmation ? null : timestamp(),
    });

    if (options.requiresConfirmation) {
      return {
        data: {
          type: 'user',
          id: user.id,
          attributes: user,
        },
        meta: {
          message: 'A confirmation email has been sent to your email address.',
        },
      };
    }

    return this.signInResponse(userOverrides);
  },

  /**
   * Create a current user response
   */
  currentUserResponse(userOverrides: UserFixture = {}) {
    const user = createUser(userOverrides);
    return {
      data: {
        type: 'user',
        id: user.id,
        attributes: user,
      },
    };
  },

  /**
   * Create an invalid credentials error
   */
  invalidCredentialsError() {
    return jsonApiError('invalid_credentials', 'Invalid email or password', 401);
  },

  /**
   * Create an unauthorized error
   */
  unauthorizedError() {
    return jsonApiError('unauthorized', 'You must be logged in to access this resource', 401);
  },

  /**
   * Create a token expired error
   */
  tokenExpiredError() {
    return jsonApiError('token_expired', 'Your session has expired', 401);
  },

  /**
   * Create an email not confirmed error
   */
  emailNotConfirmedError() {
    return jsonApiError('email_not_confirmed', 'Please confirm your email address', 401);
  },

  /**
   * Create an email already taken error
   */
  emailTakenError() {
    return jsonApiError('already_exists', 'Email has already been taken', 422, '/data/attributes/email');
  },
};

// ============================================================================
// Product Fixtures
// ============================================================================

export interface ProductFixture {
  id?: string;
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  currency?: string;
  status?: 'active' | 'inactive' | 'draft';
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create a product fixture
 */
export function createProduct(overrides: ProductFixture = {}): ProductFixture {
  const id = overrides.id ?? generateId();
  return {
    id,
    name: overrides.name ?? `Test Product ${id}`,
    description: overrides.description ?? `Description for product ${id}`,
    sku: overrides.sku ?? `SKU-${id}`,
    price: overrides.price ?? 9999, // cents
    currency: overrides.currency ?? 'USD',
    status: overrides.status ?? 'active',
    imageUrl: overrides.imageUrl ?? null,
    createdAt: overrides.createdAt ?? timestamp(),
    updatedAt: overrides.updatedAt ?? timestamp(),
    ...overrides,
  };
}

export const products = {
  /**
   * Create a product response
   */
  productResponse(overrides: ProductFixture = {}) {
    const product = createProduct(overrides);
    return jsonApiResponse('product', product, product.id);
  },

  /**
   * Create a products list response
   */
  listResponse(count: number = 10, overrides: Partial<ProductFixture> = {}) {
    const items = Array.from({ length: count }, (_, i) =>
      createProduct({ ...overrides, id: overrides.id ? `${overrides.id}-${i}` : undefined })
    );
    return jsonApiListResponse(
      'product',
      items.map((p) => ({ id: p.id, attributes: p })),
      { total: count }
    );
  },

  /**
   * Create a product not found error
   */
  notFoundError(id: string) {
    return jsonApiError('not_found', `Product with id ${id} not found`, 404);
  },
};

// ============================================================================
// Search Fixtures
// ============================================================================

export interface SearchResultFixture {
  id?: string;
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  score?: number;
}

export function createSearchResult(overrides: SearchResultFixture = {}): SearchResultFixture {
  const id = overrides.id ?? generateId();
  return {
    id,
    title: overrides.title ?? `Search Result ${id}`,
    description: overrides.description ?? `Description for result ${id}`,
    type: overrides.type ?? 'product',
    url: overrides.url ?? `/products/${id}`,
    score: overrides.score ?? Math.random(),
    ...overrides,
  };
}

export const search = {
  /**
   * Create a search results response
   */
  resultsResponse(count: number = 10, query?: string) {
    const results = Array.from({ length: count }, () => createSearchResult());
    return {
      data: results.map((r) => ({
        type: 'search-result',
        id: r.id,
        attributes: r,
      })),
      meta: {
        query: query ?? 'test query',
        total: count,
        took: Math.floor(Math.random() * 100),
      },
    };
  },

  /**
   * Create an empty search results response
   */
  emptyResponse(query?: string) {
    return {
      data: [],
      meta: {
        query: query ?? 'test query',
        total: 0,
        took: Math.floor(Math.random() * 50),
      },
    };
  },
};

// ============================================================================
// Generic Fixtures
// ============================================================================

export const generic = {
  /**
   * Create a success response with no data
   */
  emptySuccess() {
    return { data: null };
  },

  /**
   * Create a validation error response
   */
  validationError(field: string, message: string) {
    return jsonApiError('validation_error', message, 422, `/data/attributes/${field}`);
  },

  /**
   * Create a not found error
   */
  notFoundError(resource: string, id: string) {
    return jsonApiError('not_found', `${resource} with id ${id} not found`, 404);
  },

  /**
   * Create a forbidden error
   */
  forbiddenError(message: string = 'You do not have permission to access this resource') {
    return jsonApiError('forbidden', message, 403);
  },

  /**
   * Create an internal server error
   */
  serverError(message: string = 'An unexpected error occurred') {
    return jsonApiError('internal_error', message, 500);
  },

  /**
   * Create a rate limit error
   */
  rateLimitError(retryAfter: number = 60) {
    return {
      errors: [
        {
          code: 'rate_limit_exceeded',
          detail: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          status: '429',
          meta: { retryAfter },
        },
      ],
    };
  },
};

// ============================================================================
// Export all fixtures
// ============================================================================

export const fixtures = {
  auth,
  products,
  search,
  generic,
  // Utility functions
  createUser,
  createProduct,
  createSearchResult,
  jsonApiResponse,
  jsonApiListResponse,
  jsonApiError,
  generateId,
  resetIdCounter,
  uuid,
  timestamp,
};
