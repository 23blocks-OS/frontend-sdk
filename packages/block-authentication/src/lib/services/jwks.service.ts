import type { Transport } from '@23blocks/contracts';
import type {
  JsonWebKey,
  JwksResponse,
  RsaKey,
  CreateRsaKeyRequest,
  RotateRsaKeyRequest,
} from '../types/jwks.js';

/**
 * JWKS Service Interface - JSON Web Key Set operations
 */
export interface JwksService {
  /**
   * Get the public JWKS (JSON Web Key Set)
   * Typically accessed at /.well-known/jwks.json
   */
  getJwks(): Promise<JwksResponse>;

  /**
   * Get a specific JSON Web Key by key ID
   */
  getKey(kid: string): Promise<JsonWebKey | null>;
}

/**
 * Admin RSA Keys Service Interface - Key management for administrators
 */
export interface AdminRsaKeysService {
  /**
   * List all RSA keys
   */
  list(): Promise<RsaKey[]>;

  /**
   * Get a specific RSA key by ID
   */
  get(keyId: string): Promise<RsaKey>;

  /**
   * Create a new RSA key
   */
  create(request: CreateRsaKeyRequest): Promise<RsaKey>;

  /**
   * Rotate RSA keys (create new key and deactivate old ones)
   */
  rotate(request: RotateRsaKeyRequest): Promise<RsaKey>;

  /**
   * Deactivate an RSA key
   */
  deactivate(keyId: string): Promise<RsaKey>;

  /**
   * Delete an RSA key
   */
  delete(keyId: string): Promise<void>;

  /**
   * Get the currently active RSA key
   */
  getActive(): Promise<RsaKey | null>;
}

/**
 * Create the JWKS service
 */
export function createJwksService(transport: Transport): JwksService {
  return {
    async getJwks(): Promise<JwksResponse> {
      const response = await transport.get<{
        keys: Array<{
          kty: string;
          use?: string;
          key_ops?: string[];
          alg?: string;
          kid?: string;
          x5u?: string;
          x5c?: string[];
          x5t?: string;
          'x5t#S256'?: string;
          n?: string;
          e?: string;
          crv?: string;
          x?: string;
          y?: string;
        }>;
      }>('/.well-known/jwks.json');

      return {
        keys: response.keys.map((key) => ({
          kty: key.kty,
          use: key.use,
          key_ops: key.key_ops,
          alg: key.alg,
          kid: key.kid,
          x5u: key.x5u,
          x5c: key.x5c,
          x5t: key.x5t,
          'x5t#S256': key['x5t#S256'],
          n: key.n,
          e: key.e,
          crv: key.crv,
          x: key.x,
          y: key.y,
        })),
      };
    },

    async getKey(kid: string): Promise<JsonWebKey | null> {
      const jwks = await this.getJwks();
      return jwks.keys.find((key) => key.kid === kid) ?? null;
    },
  };
}

/**
 * Create the Admin RSA Keys service
 */
export function createAdminRsaKeysService(transport: Transport): AdminRsaKeysService {
  return {
    async list(): Promise<RsaKey[]> {
      const response = await transport.get<{
        data: Array<{
          id: string;
          type: string;
          attributes: {
            kid: string;
            algorithm: string;
            created_at: string;
            expires_at?: string;
            is_active: boolean;
            public_key: string;
          };
        }>;
      }>('/admin/rsa_keys');

      return response.data.map((item) => ({
        id: item.id,
        kid: item.attributes.kid,
        algorithm: item.attributes.algorithm,
        createdAt: new Date(item.attributes.created_at),
        expiresAt: item.attributes.expires_at ? new Date(item.attributes.expires_at) : undefined,
        isActive: item.attributes.is_active,
        publicKey: item.attributes.public_key,
      }));
    },

    async get(keyId: string): Promise<RsaKey> {
      const response = await transport.get<{
        data: {
          id: string;
          type: string;
          attributes: {
            kid: string;
            algorithm: string;
            created_at: string;
            expires_at?: string;
            is_active: boolean;
            public_key: string;
          };
        };
      }>(`/admin/rsa_keys/${keyId}`);

      return {
        id: response.data.id,
        kid: response.data.attributes.kid,
        algorithm: response.data.attributes.algorithm,
        createdAt: new Date(response.data.attributes.created_at),
        expiresAt: response.data.attributes.expires_at
          ? new Date(response.data.attributes.expires_at)
          : undefined,
        isActive: response.data.attributes.is_active,
        publicKey: response.data.attributes.public_key,
      };
    },

    async create(request: CreateRsaKeyRequest): Promise<RsaKey> {
      const response = await transport.post<{
        data: {
          id: string;
          type: string;
          attributes: {
            kid: string;
            algorithm: string;
            created_at: string;
            expires_at?: string;
            is_active: boolean;
            public_key: string;
          };
        };
      }>('/admin/rsa_keys', {
        rsa_key: {
          algorithm: request.algorithm,
          expires_at: request.expiresAt,
        },
      });

      return {
        id: response.data.id,
        kid: response.data.attributes.kid,
        algorithm: response.data.attributes.algorithm,
        createdAt: new Date(response.data.attributes.created_at),
        expiresAt: response.data.attributes.expires_at
          ? new Date(response.data.attributes.expires_at)
          : undefined,
        isActive: response.data.attributes.is_active,
        publicKey: response.data.attributes.public_key,
      };
    },

    async rotate(request: RotateRsaKeyRequest): Promise<RsaKey> {
      const response = await transport.post<{
        data: {
          id: string;
          type: string;
          attributes: {
            kid: string;
            algorithm: string;
            created_at: string;
            expires_at?: string;
            is_active: boolean;
            public_key: string;
          };
        };
      }>('/admin/rsa_keys/rotate', {
        rsa_key: {
          algorithm: request.algorithm,
          expires_at: request.expiresAt,
        },
      });

      return {
        id: response.data.id,
        kid: response.data.attributes.kid,
        algorithm: response.data.attributes.algorithm,
        createdAt: new Date(response.data.attributes.created_at),
        expiresAt: response.data.attributes.expires_at
          ? new Date(response.data.attributes.expires_at)
          : undefined,
        isActive: response.data.attributes.is_active,
        publicKey: response.data.attributes.public_key,
      };
    },

    async deactivate(keyId: string): Promise<RsaKey> {
      const response = await transport.put<{
        data: {
          id: string;
          type: string;
          attributes: {
            kid: string;
            algorithm: string;
            created_at: string;
            expires_at?: string;
            is_active: boolean;
            public_key: string;
          };
        };
      }>(`/admin/rsa_keys/${keyId}/deactivate`, {});

      return {
        id: response.data.id,
        kid: response.data.attributes.kid,
        algorithm: response.data.attributes.algorithm,
        createdAt: new Date(response.data.attributes.created_at),
        expiresAt: response.data.attributes.expires_at
          ? new Date(response.data.attributes.expires_at)
          : undefined,
        isActive: response.data.attributes.is_active,
        publicKey: response.data.attributes.public_key,
      };
    },

    async delete(keyId: string): Promise<void> {
      await transport.delete(`/admin/rsa_keys/${keyId}`);
    },

    async getActive(): Promise<RsaKey | null> {
      const keys = await this.list();
      return keys.find((key) => key.isActive) ?? null;
    },
  };
}
