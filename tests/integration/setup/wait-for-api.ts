#!/usr/bin/env npx ts-node

/**
 * Standalone script to wait for API to be ready
 * Can be run via: npm run test:wait-for-api
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '30', 10);
const RETRY_INTERVAL = parseInt(process.env.RETRY_INTERVAL || '2000', 10);

async function waitForApi(): Promise<void> {
  console.log(`Waiting for API at ${API_URL}...`);
  console.log(`Max retries: ${MAX_RETRIES}, Interval: ${RETRY_INTERVAL}ms`);

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log(`\nAPI is ready! Health check response:`, data);
        process.exit(0);
      } else {
        process.stdout.write(`[${response.status}]`);
      }
    } catch (error) {
      process.stdout.write('.');
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  console.error(`\nAPI did not become ready after ${MAX_RETRIES * RETRY_INTERVAL / 1000} seconds`);
  process.exit(1);
}

waitForApi();
