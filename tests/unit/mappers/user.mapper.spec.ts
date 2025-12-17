import { describe, it, expect } from 'vitest';
import { userMapper, roleMapper, permissionMapper } from '../../../packages/block-authentication/src/lib/mappers/user.mapper';
import type { JsonApiResource, IncludedMap } from '@23blocks/jsonapi-codec';

describe('User Mappers', () => {
  describe('permissionMapper', () => {
    it('should map a permission resource correctly', () => {
      const resource: JsonApiResource = {
        id: 'perm-001',
        type: 'permission',
        attributes: {
          unique_id: 'perm-unique-001',
          name: 'create_users',
          level: 5,
          parent_id: 'parent-001',
          description: 'Can create new users',
          status: 'active',
          category: 'admin',
          risk_level: 'high',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T12:00:00Z',
        },
      };

      const result = permissionMapper.map(resource, new Map());

      expect(result.id).toBe('perm-001');
      expect(result.uniqueId).toBe('perm-unique-001');
      expect(result.name).toBe('create_users');
      expect(result.level).toBe(5);
      expect(result.parentId).toBe('parent-001');
      expect(result.description).toBe('Can create new users');
      expect(result.status).toBe('active');
      expect(result.category).toBe('admin');
      expect(result.riskLevel).toBe('high');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle missing optional fields', () => {
      const resource: JsonApiResource = {
        id: 'perm-002',
        type: 'permission',
        attributes: {
          name: 'read_users',
        },
      };

      const result = permissionMapper.map(resource, new Map());

      expect(result.id).toBe('perm-002');
      expect(result.name).toBe('read_users');
      expect(result.level).toBe(0);
      expect(result.status).toBe('active');
    });
  });

  describe('roleMapper', () => {
    it('should map a role resource correctly', () => {
      const resource: JsonApiResource = {
        id: 'role-001',
        type: 'role',
        attributes: {
          unique_id: 'role-unique-001',
          name: 'Administrator',
          code: 'admin',
          description: 'Full access to all features',
          status: 'active',
          payload: { key: 'value' },
          on_boarding_unique_id: 'onboard-001',
          on_boarding_url: '/onboarding/admin',
          on_boarding_payload: { step: 1 },
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T12:00:00Z',
        },
      };

      const result = roleMapper.map(resource, new Map());

      expect(result.id).toBe('role-001');
      expect(result.uniqueId).toBe('role-unique-001');
      expect(result.name).toBe('Administrator');
      expect(result.code).toBe('admin');
      expect(result.description).toBe('Full access to all features');
      expect(result.status).toBe('active');
      expect(result.payload).toEqual({ key: 'value' });
      expect(result.onBoardingUniqueId).toBe('onboard-001');
      expect(result.onBoardingUrl).toBe('/onboarding/admin');
      expect(result.onBoardingPayload).toEqual({ step: 1 });
      expect(result.permissions).toEqual([]);
    });

    it('should default to active status', () => {
      const resource: JsonApiResource = {
        id: 'role-002',
        type: 'role',
        attributes: {
          name: 'User',
        },
      };

      const result = roleMapper.map(resource, new Map());

      expect(result.status).toBe('active');
    });
  });

  describe('userMapper', () => {
    it('should map a user resource correctly', () => {
      const resource: JsonApiResource = {
        id: 'user-001',
        type: 'User',
        attributes: {
          unique_id: 'user-unique-001',
          email: 'test@example.com',
          username: 'testuser',
          name: 'Test User',
          nickname: 'testy',
          bio: 'A test user for testing',
          provider: 'email',
          uid: 'test@example.com',
          role_id: 'role-001',
          status: 'active',
          mail_status: 'verified',
          phone_status: 'unverified',
          allow_password_change: true,
          last_sign_in_at: '2024-01-15T08:00:00Z',
          confirmed_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        relationships: {},
      };

      const included: IncludedMap = new Map();
      const result = userMapper.map(resource, included);

      expect(result.id).toBe('user-001');
      expect(result.uniqueId).toBe('user-unique-001');
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
      expect(result.name).toBe('Test User');
      expect(result.nickname).toBe('testy');
      expect(result.bio).toBe('A test user for testing');
      expect(result.provider).toBe('email');
      expect(result.uid).toBe('test@example.com');
      expect(result.roleId).toBe('role-001');
      expect(result.status).toBe('active');
      expect(result.mailStatus).toBe('verified');
      expect(result.phoneStatus).toBe('unverified');
      expect(result.allowPasswordChange).toBe(true);
      expect(result.lastSignInAt).toBeInstanceOf(Date);
      expect(result.confirmedAt).toBeInstanceOf(Date);
    });

    it('should resolve related role from included resources', () => {
      const resource: JsonApiResource = {
        id: 'user-002',
        type: 'User',
        attributes: {
          email: 'user@example.com',
        },
        relationships: {
          role: {
            data: { type: 'role', id: 'role-001' },
          },
        },
      };

      const included: IncludedMap = new Map();
      included.set('role:role-001', {
        id: 'role-001',
        type: 'role',
        attributes: {
          name: 'Admin',
          code: 'admin',
        },
      });

      const result = userMapper.map(resource, included);

      expect(result.role).toBeDefined();
      expect(result.role?.name).toBe('Admin');
      expect(result.role?.code).toBe('admin');
    });

    it('should handle missing relationships gracefully', () => {
      const resource: JsonApiResource = {
        id: 'user-003',
        type: 'User',
        attributes: {
          email: 'minimal@example.com',
        },
      };

      const result = userMapper.map(resource, new Map());

      expect(result.id).toBe('user-003');
      expect(result.email).toBe('minimal@example.com');
      // Missing relationships return null (not undefined) based on resolveRelationship behavior
      expect(result.role).toBeNull();
      expect(result.avatar).toBeNull();
      expect(result.profile).toBeNull();
    });

    it('should default to email provider if not specified', () => {
      const resource: JsonApiResource = {
        id: 'user-004',
        type: 'User',
        attributes: {
          email: 'user@example.com',
        },
      };

      const result = userMapper.map(resource, new Map());

      expect(result.provider).toBe('email');
    });

    it('should use email as uid if uid not provided', () => {
      const resource: JsonApiResource = {
        id: 'user-005',
        type: 'User',
        attributes: {
          email: 'user@example.com',
        },
      };

      const result = userMapper.map(resource, new Map());

      expect(result.uid).toBe('user@example.com');
    });
  });
});
