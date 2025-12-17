/**
 * Integration tests for the Search Block
 *
 * These tests run against a real API in Docker.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getTestTransport, getTestConfig, uniqueName } from '../setup/test-client';
import { createSearchBlock } from '@23blocks/block-search';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

describe('Search Block - Integration', () => {
  const transport = getTestTransport();
  const search = createSearchBlock(transport, getTestConfig('search'));
  const auth = createAuthenticationBlock(transport, getTestConfig('authentication'));

  beforeAll(async () => {
    // Authenticate before running search tests
    await auth.auth.signIn({
      email: 'seeded-user@example.com',
      password: 'TestPassword123!',
    });
  });

  describe('Search Operations', () => {
    it('should perform a basic search', async () => {
      const result = await search.search.search({
        query: 'test',
      });

      expect(result).toBeDefined();
      expect(result.results).toBeInstanceOf(Array);
    });

    it('should search with pagination', async () => {
      const result = await search.search.search({
        query: 'test',
        page: 1,
        perPage: 5,
      });

      expect(result).toBeDefined();
      expect(result.results).toBeInstanceOf(Array);
      expect(result.results.length).toBeLessThanOrEqual(5);
    });

    it('should search with entity type filter', async () => {
      const result = await search.search.search({
        query: 'test',
        entityTypes: ['product'],
      });

      expect(result).toBeDefined();
      expect(result.results).toBeInstanceOf(Array);
      // All results should be of type 'product'
      result.results.forEach((item) => {
        expect(item.entityType).toBe('product');
      });
    });

    it('should return empty results for non-matching query', async () => {
      const result = await search.search.search({
        query: 'xyznonexistentquery12345',
      });

      expect(result).toBeDefined();
      expect(result.results).toBeInstanceOf(Array);
      expect(result.results.length).toBe(0);
    });
  });

  describe('Suggestions', () => {
    it('should get search suggestions', async () => {
      const result = await search.search.suggest('test');

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
    });

    it('should return limited suggestions', async () => {
      const result = await search.search.suggest('test', 3);

      expect(result).toBeDefined();
      expect(result.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Entity Types', () => {
    it('should list available entity types', async () => {
      const result = await search.search.entityTypes();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Search History', () => {
    it('should get recent search queries', async () => {
      // First perform a search to have history
      await search.search.search({ query: 'test history' });

      const result = await search.history.getLastQueries();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
    });

    it('should get limited recent queries', async () => {
      const result = await search.history.getLastQueries(5);

      expect(result).toBeDefined();
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should clear search history', async () => {
      // First add some history
      await search.search.search({ query: 'to be cleared' });

      // Clear it
      await expect(search.history.clear()).resolves.not.toThrow();
    });
  });

  describe('Favorites', () => {
    it('should list favorites', async () => {
      const result = await search.favorites.list();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
    });

    it('should add and remove a favorite', async () => {
      // Search for something first
      const searchResult = await search.search.search({ query: 'test' });

      if (searchResult.results.length > 0) {
        const entity = searchResult.results[0];

        // Add to favorites
        const addResult = await search.favorites.add({
          entityUniqueId: entity.uniqueId,
          entityType: entity.entityType,
        });

        expect(addResult).toBeDefined();
        expect(addResult.entityUniqueId).toBe(entity.uniqueId);

        // Check if favorited
        const isFav = await search.favorites.isFavorite(entity.uniqueId);
        expect(isFav).toBe(true);

        // Remove from favorites
        await expect(
          search.favorites.remove(addResult.id)
        ).resolves.not.toThrow();

        // Verify removed
        const isFavAfter = await search.favorites.isFavorite(entity.uniqueId);
        expect(isFavAfter).toBe(false);
      }
    });
  });

  describe('Entities Service', () => {
    it('should list entities', async () => {
      const result = await search.entities.list({
        page: 1,
        perPage: 10,
      });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
    });

    it('should register, get, update, and delete an entity', async () => {
      const uniqueId = `test-entity-${Date.now()}`;
      const name = uniqueName('TestEntity');

      // Register
      const created = await search.entities.register(uniqueId, {
        name,
        entityType: 'product',
        data: { description: 'A test entity' },
      });

      expect(created).toBeDefined();
      expect(created.name).toBe(name);

      // Get
      const fetched = await search.entities.get(uniqueId);
      expect(fetched).toBeDefined();
      expect(fetched.name).toBe(name);

      // Update
      const updatedName = name + ' Updated';
      const updated = await search.entities.update(uniqueId, {
        name: updatedName,
      });
      expect(updated.name).toBe(updatedName);

      // Delete
      await expect(search.entities.delete(uniqueId)).resolves.not.toThrow();

      // Verify deleted
      await expect(search.entities.get(uniqueId)).rejects.toThrow();
    });

    it('should list registered entity types', async () => {
      const result = await search.entities.listEntityTypes();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Identities Service', () => {
    it('should list identities', async () => {
      const result = await search.identities.list({
        page: 1,
        perPage: 10,
      });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
    });

    it('should register and get an identity', async () => {
      const uniqueId = `test-identity-${Date.now()}`;

      // Register
      const created = await search.identities.register(uniqueId, {
        name: 'Test Identity',
        email: `identity-${Date.now()}@example.com`,
      });

      expect(created).toBeDefined();

      // Get
      const fetched = await search.identities.get(uniqueId);
      expect(fetched).toBeDefined();
      expect(fetched.name).toBe('Test Identity');
    });
  });
});
