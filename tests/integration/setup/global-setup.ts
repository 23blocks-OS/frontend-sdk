/**
 * Global setup for integration tests
 * Ensures Docker containers are running before tests start
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const API_URL = process.env.API_URL || 'http://localhost:3000';
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 2000;

async function waitForApi(): Promise<void> {
  console.log(`\nWaiting for API at ${API_URL}...`);

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        console.log('API is ready!\n');
        return;
      }
    } catch {
      // API not ready yet
    }

    process.stdout.write('.');
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  throw new Error(`API did not become ready after ${MAX_RETRIES * RETRY_INTERVAL / 1000} seconds`);
}

async function startDocker(): Promise<void> {
  const skipDocker = process.env.SKIP_DOCKER === 'true';

  if (skipDocker) {
    console.log('SKIP_DOCKER=true, assuming containers are already running');
    return;
  }

  console.log('Starting Docker containers...');

  try {
    await execAsync('docker-compose -f docker/docker-compose.yml up -d', {
      cwd: process.cwd(),
    });
    console.log('Docker containers started');
  } catch (error) {
    console.error('Failed to start Docker containers:', error);
    throw error;
  }
}

export default async function globalSetup(): Promise<void> {
  console.log('\n=== Integration Test Setup ===\n');

  // Start Docker if not skipped
  await startDocker();

  // Wait for API to be ready
  await waitForApi();

  console.log('=== Setup Complete ===\n');
}
