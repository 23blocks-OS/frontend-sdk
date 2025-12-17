/**
 * Shared test client configuration for integration tests
 */

import { createHttpTransport, type HttpTransport } from '@23blocks/transport-http';

// Environment configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const TEST_API_KEY = process.env.TEST_API_KEY || 'test-api-key';

// Singleton transport instance
let transportInstance: HttpTransport | null = null;

/**
 * Get a configured transport for testing
 * Uses a singleton pattern to reuse connections
 */
export function getTestTransport(): HttpTransport {
  if (!transportInstance) {
    transportInstance = createHttpTransport({
      baseUrl: API_URL,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
    });
  }
  return transportInstance;
}

/**
 * Get block configuration for a specific service
 */
export function getTestConfig(service: string): Record<string, string> {
  const configs: Record<string, Record<string, string>> = {
    authentication: {
      apiKey: TEST_API_KEY,
    },
    search: {
      apiKey: TEST_API_KEY,
    },
    crm: {
      apiKey: TEST_API_KEY,
    },
    products: {
      apiKey: TEST_API_KEY,
    },
    files: {
      apiKey: TEST_API_KEY,
    },
    // Add more as needed
  };

  return configs[service] || { apiKey: TEST_API_KEY };
}

/**
 * Reset the transport (useful between test suites)
 */
export function resetTransport(): void {
  transportInstance = null;
}

/**
 * Get the base API URL
 */
export function getApiUrl(): string {
  return API_URL;
}

/**
 * Generate a unique email for testing
 */
export function uniqueEmail(prefix = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

/**
 * Generate a unique name for testing
 */
export function uniqueName(prefix = 'Test'): string {
  return `${prefix}-${Date.now().toString(36)}`;
}
