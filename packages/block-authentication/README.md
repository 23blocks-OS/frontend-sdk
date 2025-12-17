# @23blocks/block-authentication

Authentication block for the 23blocks SDK - users, roles, API keys, and identity management.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-authentication.svg)](https://www.npmjs.com/package/@23blocks/block-authentication)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-authentication @23blocks/transport-http
```

## Overview

This package provides comprehensive authentication and identity management including:

- **Authentication** - Sign in, sign up, sign out, password reset
- **Users** - User management, profiles, avatars
- **Roles & Permissions** - Role-based access control
- **API Keys** - Create and manage API keys
- **MFA** - Multi-factor authentication
- **OAuth** - Social login and token management
- **Tenants** - Multi-tenant user management

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

// Create transport with your authentication service URL
const transport = createHttpTransport({
  baseUrl: 'https://auth.yourapp.com', // Your authentication service URL
  headers: () => {
    const token = localStorage.getItem('access_token');
    return {
      'x-api-key': 'your-api-key',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },
});

// Create block
const auth = createAuthenticationBlock(transport, {
  apiKey: 'your-api-key',
});

// Sign in
const { user, accessToken, refreshToken } = await auth.auth.signIn({
  email: 'user@example.com',
  password: 'password',
});

localStorage.setItem('access_token', accessToken);
console.log('Welcome', user.email);

// Get current user
const currentUser = await auth.auth.getCurrentUser();

// Sign out
await auth.auth.signOut();
localStorage.removeItem('access_token');
```

## Services

### auth - Authentication

#### Sign In

```typescript
// Required fields: email, password
const { user, accessToken, refreshToken, expiresIn } = await auth.auth.signIn({
  email: 'user@example.com',    // Required
  password: 'password',          // Required
});
```

**SignInRequest:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | **Yes** | User's email address |
| `password` | string | **Yes** | User's password |

**SignInResponse:**
| Field | Type | Description |
|-------|------|-------------|
| `user` | User | The authenticated user object |
| `accessToken` | string | JWT access token |
| `refreshToken` | string? | Refresh token (if enabled) |
| `tokenType` | string | Always "Bearer" |
| `expiresIn` | number? | Token expiration in seconds |

#### Sign Up (Registration)

```typescript
// Sign up with required fields only
const { user, accessToken, message } = await auth.auth.signUp({
  email: 'newuser@example.com',       // Required
  password: 'securePassword123',       // Required
  passwordConfirmation: 'securePassword123', // Required - must match password
});

// Sign up with all optional fields
const { user, accessToken, message } = await auth.auth.signUp({
  // Required fields
  email: 'newuser@example.com',
  password: 'securePassword123',
  passwordConfirmation: 'securePassword123',

  // Optional fields
  name: 'John Doe',                    // Display name
  username: 'johndoe',                 // Unique username
  roleId: 'role-uuid',                 // Assign specific role
  confirmSuccessUrl: 'https://yourapp.com/email-confirmed', // Redirect after email confirmation
  timeZone: 'America/New_York',        // User's timezone
  preferredLanguage: 'en',             // Language preference
  payload: { customField: 'value' },   // Custom JSON data
  uniqueId: 'custom-id-123',           // Custom unique identifier
  subscription: 'premium-plan',        // Subscription model unique_id

  // OAuth registration (when registering via social login)
  provider: 'google',                  // OAuth provider
  uid: 'google-user-id',               // OAuth user ID
});
```

**SignUpRequest:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | **Yes** | User's email address |
| `password` | string | **Yes** | Password (min length depends on server config) |
| `passwordConfirmation` | string | **Yes** | Must match password exactly |
| `name` | string | No | User's display name |
| `username` | string | No | Unique username |
| `roleId` | string | No | Role ID to assign |
| `confirmSuccessUrl` | string | No | URL to redirect after email confirmation |
| `timeZone` | string | No | IANA timezone (e.g., 'America/New_York') |
| `preferredLanguage` | string | No | Language code (e.g., 'en', 'es') |
| `payload` | object | No | Custom JSON data stored with user |
| `uniqueId` | string | No | Custom unique identifier |
| `subscription` | string | No | Subscription model unique_id |
| `provider` | string | No | OAuth provider name |
| `uid` | string | No | OAuth user ID |

**SignUpResponse:**
| Field | Type | Description |
|-------|------|-------------|
| `user` | User | The created user object |
| `accessToken` | string? | JWT token (only if email confirmation is disabled) |
| `message` | string? | Server message (e.g., "Confirmation email sent") |

> **Note:** If email confirmation is enabled on the server, `accessToken` will be `undefined` and the user must confirm their email before signing in.

#### Sign Out

```typescript
await auth.auth.signOut();
```

#### Get Current User

```typescript
// Returns user with role, avatar, and profile included
const user = await auth.auth.getCurrentUser();
console.log(user.email, user.role?.name, user.avatar?.url);
```

#### Validate Token

```typescript
const { user, valid } = await auth.auth.validateToken();
if (valid) {
  console.log('Token is valid for', user.email);
}
```

#### Password Reset

```typescript
// Request password reset email
await auth.auth.requestPasswordReset({
  email: 'user@example.com',           // Required
  redirectUrl: 'https://yourapp.com/reset-password', // Optional
});

// Update password with reset token (from email link)
await auth.auth.updatePassword({
  password: 'newSecurePassword',              // Required
  passwordConfirmation: 'newSecurePassword',  // Required
  resetPasswordToken: 'token-from-email',     // Required for reset
});

// Update password with current password (logged in user)
await auth.auth.updatePassword({
  password: 'newSecurePassword',              // Required
  passwordConfirmation: 'newSecurePassword',  // Required
  currentPassword: 'oldPassword',             // Required for change
});
```

**PasswordResetRequest:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | **Yes** | User's email address |
| `redirectUrl` | string | No | URL for password reset page |

**PasswordUpdateRequest:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `password` | string | **Yes** | New password |
| `passwordConfirmation` | string | **Yes** | Must match password |
| `resetPasswordToken` | string | Conditional | Required when using reset link |
| `currentPassword` | string | Conditional | Required when changing password |

#### Refresh Token

```typescript
const { accessToken, refreshToken, expiresIn } = await auth.auth.refreshToken({
  refreshToken: 'current-refresh-token', // Required
});
```

#### Magic Link (Passwordless Login)

```typescript
// Request magic link email
await auth.auth.requestMagicLink({
  email: 'user@example.com',                    // Required
  redirectUrl: 'https://yourapp.com/magic-link', // Optional
});

// Verify magic link token (from email)
const { user, accessToken, refreshToken } = await auth.auth.verifyMagicLink({
  token: 'magic-link-token', // Required
});
```

#### Invitations

```typescript
// Send invitation to new user
await auth.auth.sendInvitation({
  email: 'newuser@example.com',                     // Required
  roleId: 'role-id',                                // Optional
  redirectUrl: 'https://yourapp.com/accept-invite', // Optional
});

// Accept invitation
const { user, accessToken } = await auth.auth.acceptInvitation({
  invitationToken: 'invitation-token',    // Required
  password: 'password',                    // Required
  passwordConfirmation: 'password',        // Required - must match password
  name: 'John Doe',                        // Optional
});

// Resend invitation
const user = await auth.auth.resendInvitation({
  email: 'user@example.com',                        // Required
  appid: 'app-id',                                  // Optional
  acceptInvitationUrl: 'https://yourapp.com/accept', // Optional
});
```

**AcceptInvitationRequest:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `invitationToken` | string | **Yes** | Token from invitation email |
| `password` | string | **Yes** | New password |
| `passwordConfirmation` | string | **Yes** | Must match password |
| `name` | string | No | User's display name |

#### Email Confirmation

```typescript
// Confirm email with token (from confirmation email link)
const user = await auth.auth.confirmEmail('confirmation-token');

// Resend confirmation email
await auth.auth.resendConfirmation({
  email: 'user@example.com',                        // Required
  confirmSuccessUrl: 'https://yourapp.com/confirmed', // Optional - redirect URL
});
```

**ResendConfirmationRequest:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | **Yes** | User's email address |
| `confirmSuccessUrl` | string | No | URL to redirect after confirmation |

#### Email & Document Validation

```typescript
// Validate email before registration
const { exists, wellFormed, canRecover, accountStatus, maskedEmail } =
  await auth.auth.validateEmail({
    email: 'user@example.com',
  });

if (exists) {
  console.log('Email already registered');
}

// Validate document before registration
const { exists, canRecover, maskedEmail, maskedDocument, accountStatus } =
  await auth.auth.validateDocument({
    documentType: 'national_id',
    documentNumber: '12345678',
  });
```

#### Account Recovery (Deleted Accounts)

```typescript
// Request account recovery for a deleted account
const { success, message } = await auth.auth.requestAccountRecovery({
  email: 'user@example.com',                    // Required
  recoveryUrl: 'https://yourapp.com/recover',   // Optional
});

// Complete account recovery with new password
const user = await auth.auth.completeAccountRecovery({
  recoveryToken: 'recovery-token',        // Required
  password: 'newPassword',                 // Required
  passwordConfirmation: 'newPassword',     // Required
});
```

### users - User Management

```typescript
// List users (admin)
const { data: users, meta } = await auth.users.list({
  limit: 20,
  offset: 0,
});

// Get user by ID
const user = await auth.users.get('user-id');

// Update user
const updated = await auth.users.update('user-id', {
  name: 'New Name',
  roleId: 'new-role-id',
});

// Delete user (soft delete)
await auth.users.delete('user-id');

// Get/update current user's profile
const profile = await auth.users.getProfile();
const updatedProfile = await auth.users.updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890',
});

// User devices
const devices = await auth.users.getDevices();
const device = await auth.users.addDevice({
  deviceType: 'mobile',
  pushId: 'push-token',
  osType: 'ios',
});
await auth.users.removeDevice('device-id');

// Search users
const results = await auth.users.search({
  query: 'john',
  limit: 10,
});

// User subscriptions
const subscription = await auth.users.addSubscription({
  subscriptionModelId: 'model-id',
  code: 'PREMIUM',
});
```

### roles - Role Management

```typescript
// List roles
const { data: roles } = await auth.roles.list();

// Get role by ID
const role = await auth.roles.get('role-id');

// Create role (admin)
const newRole = await auth.roles.create({
  name: 'Editor',
  code: 'editor',
  permissionIds: ['perm-1', 'perm-2'],
});

// Update role
const updated = await auth.roles.update('role-id', {
  name: 'Senior Editor',
});

// Delete role
await auth.roles.delete('role-id');

// List permissions
const { data: permissions } = await auth.roles.listPermissions();
```

### apiKeys - API Key Management

```typescript
// List API keys
const { data: keys } = await auth.apiKeys.list();

// Get API key by ID
const key = await auth.apiKeys.get('key-id');

// Create API key
const { apiKey, secret } = await auth.apiKeys.create({
  name: 'My API Key',
  scopes: ['read', 'write'],
  expiresAt: '2025-12-31',
});

// Update API key
const updated = await auth.apiKeys.update('key-id', {
  name: 'Updated Name',
  scopes: ['read'],
});

// Revoke API key
await auth.apiKeys.revoke('key-id');

// Delete API key
await auth.apiKeys.delete('key-id');

// Get usage statistics
const stats = await auth.apiKeys.getUsageStats('key-id');
```

### mfa - Multi-Factor Authentication

```typescript
// Check MFA status
const { enabled, methods } = await auth.mfa.getStatus();

// Setup MFA (get QR code)
const { qrCodeUrl, secret, backupCodes } = await auth.mfa.setup();

// Enable MFA
await auth.mfa.enable({
  code: '123456',
  secret: 'secret-from-setup',
});

// Verify MFA code
const { valid } = await auth.mfa.verify({
  code: '123456',
});

// Disable MFA
await auth.mfa.disable({
  code: '123456',
});
```

### oauth - OAuth & Token Management

```typescript
// Social login
const { user, accessToken } = await auth.oauth.socialLogin({
  provider: 'google',
  accessToken: 'google-access-token',
});

// Introspect token
const { active, userId, scopes } = await auth.oauth.introspectToken('token');

// Revoke token
await auth.oauth.revokeToken({
  token: 'token-to-revoke',
});

// Revoke all tokens
await auth.oauth.revokeAllTokens();
```

### tenants - Multi-Tenant Users

```typescript
// List tenant users
const { data: tenantUsers } = await auth.tenants.listUsers({
  limit: 20,
});

// Get tenant user
const tenantUser = await auth.tenants.getUser('tenant-user-id');

// Create tenant user
const newUser = await auth.tenants.createUser({
  email: 'user@tenant.com',
  name: 'Tenant User',
  roleId: 'role-id',
});

// Update tenant user
const updated = await auth.tenants.updateUser('tenant-user-id', {
  name: 'Updated Name',
});

// Delete tenant user
await auth.tenants.deleteUser('tenant-user-id');

// Validate tenant code
const { valid, tenant } = await auth.tenants.validateCode({
  code: 'TENANT123',
});
```

### avatars - User Avatars

```typescript
// Get user avatar
const avatar = await auth.avatars.get('user-id');

// Create/upload avatar
const avatar = await auth.avatars.create({
  userId: 'user-id',
  file: fileBlob,
});

// Get presigned URL for upload
const { url, fields } = await auth.avatars.getPresignedUrl({
  filename: 'avatar.jpg',
  contentType: 'image/jpeg',
});

// Delete avatar
await auth.avatars.delete('avatar-id');
```

## Types

```typescript
import type {
  // User types
  User,
  Role,
  Permission,
  UserAvatar,
  UserProfile,

  // Auth types
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  PasswordResetRequest,
  PasswordUpdateRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  MagicLinkRequest,
  MagicLinkVerifyRequest,
  InvitationRequest,
  AcceptInvitationRequest,
  ResendConfirmationRequest,
  ValidateEmailRequest,
  ValidateEmailResponse,
  ValidateDocumentRequest,
  ValidateDocumentResponse,
  AccountRecoveryRequest,
  AccountRecoveryResponse,
  CompleteRecoveryRequest,

  // API Key types
  ApiKey,
  ApiKeyWithSecret,
  CreateApiKeyRequest,

  // MFA types
  MfaSetupResponse,
  MfaVerifyRequest,
  MfaStatusResponse,

  // Company types
  Company,
  Tenant,
} from '@23blocks/block-authentication';
```

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await auth.auth.signIn({ email, password });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.INVALID_CREDENTIALS:
        console.log('Invalid email or password');
        break;
      case ErrorCodes.UNAUTHORIZED:
        console.log('Session expired');
        break;
      case ErrorCodes.VALIDATION_ERROR:
        console.log('Validation error:', error.message);
        break;
      default:
        console.log('Error:', error.message);
    }
  }
}
```

## Related Packages

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
