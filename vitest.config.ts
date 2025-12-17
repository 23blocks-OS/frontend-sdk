import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    reporters: ['verbose'],
  },
  resolve: {
    alias: {
      '@23blocks/contracts': resolve(__dirname, 'packages/contracts/src'),
      '@23blocks/jsonapi-codec': resolve(__dirname, 'packages/jsonapi-codec/src'),
      '@23blocks/transport-http': resolve(__dirname, 'packages/transport-http/src'),
      '@23blocks/block-authentication': resolve(__dirname, 'packages/block-authentication/src'),
      '@23blocks/block-search': resolve(__dirname, 'packages/block-search/src'),
      '@23blocks/block-crm': resolve(__dirname, 'packages/block-crm/src'),
      '@23blocks/block-products': resolve(__dirname, 'packages/block-products/src'),
      '@23blocks/block-files': resolve(__dirname, 'packages/block-files/src'),
      '@23blocks/angular': resolve(__dirname, 'packages/angular/src'),
      '@23blocks/react': resolve(__dirname, 'packages/react/src'),
    },
  },
});
