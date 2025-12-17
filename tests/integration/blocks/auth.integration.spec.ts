/**
 * Integration tests for the Authentication Block
 *
 * These tests run against a real API in Docker.
 * They verify that the SDK correctly communicates with the 23blocks API.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getTestTransport, getTestConfig, uniqueEmail } from '../setup/test-client';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

describe('Authentication Block - Integration', () => {
  const transport = getTestTransport();
  const auth = createAuthenticationBlock(transport, getTestConfig('authentication'));

  describe('Registration', () => {
    it('should register a new user successfully', async () => {
      const email = uniqueEmail('register');

      const result = await auth.registration.signUp({
        email,
        password: 'SecurePassword123!',
        passwordConfirmation: 'SecurePassword123!',
      });

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.id).toBeDefined();
      expect(result.user.uniqueId).toBeDefined();
    });

    it('should reject registration with weak password', async () => {
      const email = uniqueEmail('weak-pass');

      await expect(
        auth.registration.signUp({
          email,
          password: '123', // Too weak
          passwordConfirmation: '123',
        })
      ).rejects.toThrow();
    });

    it('should reject duplicate email registration', async () => {
      // Use seeded user email from test database
      await expect(
        auth.registration.signUp({
          email: 'seeded-user@example.com',
          password: 'SecurePassword123!',
          passwordConfirmation: 'SecurePassword123!',
        })
      ).rejects.toThrow(/already|taken|registered/i);
    });

    it('should reject mismatched password confirmation', async () => {
      const email = uniqueEmail('mismatch');

      await expect(
        auth.registration.signUp({
          email,
          password: 'SecurePassword123!',
          passwordConfirmation: 'DifferentPassword123!',
        })
      ).rejects.toThrow();
    });
  });

  describe('Authentication', () => {
    it('should sign in with valid credentials', async () => {
      const result = await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.accessToken.length).toBeGreaterThan(0);
      expect(result.refreshToken).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('seeded-user@example.com');
    });

    it('should reject invalid password', async () => {
      await expect(
        auth.auth.signIn({
          email: 'seeded-user@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow(/invalid|unauthorized|incorrect/i);
    });

    it('should reject non-existent user', async () => {
      await expect(
        auth.auth.signIn({
          email: 'non-existent@example.com',
          password: 'AnyPassword123!',
        })
      ).rejects.toThrow(/not found|invalid|unauthorized/i);
    });
  });

  describe('Session Management', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      const session = await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });
      accessToken = session.accessToken;
      refreshToken = session.refreshToken;
    });

    it('should validate a valid session', async () => {
      const result = await auth.session.validate();

      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
    });

    it('should refresh access token', async () => {
      const result = await auth.tokens.refresh({
        refreshToken,
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.accessToken).not.toBe(accessToken);
    });

    it('should sign out successfully', async () => {
      // First sign in to get a fresh session
      const session = await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });

      // Then sign out
      await expect(auth.auth.signOut()).resolves.not.toThrow();
    });
  });

  describe('Password Management', () => {
    it('should send password reset email', async () => {
      // This test verifies the endpoint works, not that email is sent
      await expect(
        auth.passwords.requestReset({
          email: 'seeded-user@example.com',
        })
      ).resolves.not.toThrow();
    });

    it('should change password for authenticated user', async () => {
      // First register a new user
      const email = uniqueEmail('password-change');
      await auth.registration.signUp({
        email,
        password: 'OldPassword123!',
        passwordConfirmation: 'OldPassword123!',
      });

      // Sign in
      await auth.auth.signIn({
        email,
        password: 'OldPassword123!',
      });

      // Change password
      await expect(
        auth.passwords.change({
          currentPassword: 'OldPassword123!',
          password: 'NewPassword456!',
          passwordConfirmation: 'NewPassword456!',
        })
      ).resolves.not.toThrow();

      // Verify new password works
      await expect(
        auth.auth.signIn({
          email,
          password: 'NewPassword456!',
        })
      ).resolves.toBeDefined();
    });
  });

  describe('Profile Management', () => {
    beforeAll(async () => {
      await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });
    });

    it('should get current user profile', async () => {
      const result = await auth.profile.get();

      expect(result).toBeDefined();
      expect(result.email).toBe('seeded-user@example.com');
    });

    it('should update user profile', async () => {
      const newNickname = `nickname-${Date.now()}`;

      const result = await auth.profile.update({
        nickname: newNickname,
      });

      expect(result).toBeDefined();
      expect(result.nickname).toBe(newNickname);
    });
  });

  describe('User Management (Admin)', () => {
    // These tests require admin privileges

    it('should list users', async () => {
      // Sign in as admin user (if available in seed data)
      await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });

      const result = await auth.users.list({
        page: 1,
        perPage: 10,
      });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.meta).toBeDefined();
    });

    it('should get a specific user by ID', async () => {
      // First list to get an ID
      const list = await auth.users.list({ page: 1, perPage: 1 });

      if (list.data.length > 0) {
        const userId = list.data[0].id;
        const result = await auth.users.get(userId);

        expect(result).toBeDefined();
        expect(result.id).toBe(userId);
      }
    });
  });
});
