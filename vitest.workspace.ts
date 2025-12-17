import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      root: '.',
      include: ['tests/unit/**/*.spec.ts'],
      environment: 'node',
      testTimeout: 10000,
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'integration',
      root: '.',
      include: ['tests/integration/blocks/**/*.spec.ts'],
      environment: 'node',
      globalSetup: './tests/integration/setup/global-setup.ts',
      globalTeardown: './tests/integration/setup/global-teardown.ts',
      testTimeout: 30000,
      hookTimeout: 60000,
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'workflows',
      root: '.',
      include: ['tests/integration/workflows/**/*.spec.ts'],
      environment: 'node',
      globalSetup: './tests/integration/setup/global-setup.ts',
      globalTeardown: './tests/integration/setup/global-teardown.ts',
      testTimeout: 60000,
      hookTimeout: 120000,
    },
  },
]);
