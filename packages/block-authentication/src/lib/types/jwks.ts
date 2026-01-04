/**
 * JSON Web Key (JWK) representation
 */
export interface JsonWebKey {
  kty: string;
  use?: string;
  key_ops?: string[];
  alg?: string;
  kid?: string;
  x5u?: string;
  x5c?: string[];
  x5t?: string;
  'x5t#S256'?: string;
  // RSA specific
  n?: string;
  e?: string;
  // EC specific
  crv?: string;
  x?: string;
  y?: string;
}

/**
 * JSON Web Key Set (JWKS) response
 */
export interface JwksResponse {
  keys: JsonWebKey[];
}

/**
 * RSA Key for admin management
 */
export interface RsaKey {
  id: string;
  kid: string;
  algorithm: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  publicKey: string;
}

export interface CreateRsaKeyRequest {
  algorithm?: string;
  expiresAt?: string;
}

export interface RotateRsaKeyRequest {
  algorithm?: string;
  expiresAt?: string;
}
