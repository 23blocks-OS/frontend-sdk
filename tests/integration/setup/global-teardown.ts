/**
 * Global teardown for integration tests
 * Stops Docker containers after tests complete
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function stopDocker(): Promise<void> {
  const skipDocker = process.env.SKIP_DOCKER === 'true';
  const keepContainers = process.env.KEEP_CONTAINERS === 'true';

  if (skipDocker || keepContainers) {
    console.log('Keeping containers running (SKIP_DOCKER or KEEP_CONTAINERS is set)');
    return;
  }

  console.log('Stopping Docker containers...');

  try {
    await execAsync('docker-compose -f docker/docker-compose.yml down -v', {
      cwd: process.cwd(),
    });
    console.log('Docker containers stopped');
  } catch (error) {
    console.error('Failed to stop Docker containers:', error);
    // Don't throw - teardown should not fail the tests
  }
}

export default async function globalTeardown(): Promise<void> {
  console.log('\n=== Integration Test Teardown ===\n');

  await stopDocker();

  console.log('=== Teardown Complete ===\n');
}
