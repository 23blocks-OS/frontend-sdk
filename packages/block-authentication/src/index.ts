// Block factory and types
export {
  createAuthenticationBlock,
  type AuthenticationBlock,
  type AuthenticationBlockConfig,
  authenticationBlockMetadata,
} from './lib/authentication.block.js';

// Domain types
export {
  // User types
  type User,
  type Role,
  type Permission,
  type UserAvatar,
  type UserProfile,

  // Company types
  type Company,
  type CompanyDetail,
  type CompanyBlock,
  type CompanyKey,
  type Tenant,

  // Auth types
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type SignUpResponse,
  type PasswordResetRequest,
  type PasswordUpdateRequest,
  type TokenValidationResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type OAuthSignInRequest,
  type MagicLinkRequest,
  type MagicLinkVerifyRequest,
  type MfaSetupResponse,
  type MfaVerifyRequest,
  type InvitationRequest,
  type AcceptInvitationRequest,
  type ResendConfirmationRequest,
  type ValidateEmailRequest,
  type ValidateEmailResponse,
  type ValidateDocumentRequest,
  type ValidateDocumentResponse,
  type AuthHeaders,

  // API Key types
  type ApiKey,
  type ApiKeyWithSecret,
  type CreateApiKeyRequest,
  type UpdateApiKeyRequest,
  type RevokeApiKeyRequest,

  // Service Token types
  type ServiceToken,
  type ServiceTokenWithJwt,
  type ServiceTokenCategory,
  type CreateServiceTokenRequest,

  // MFA types
  type MfaSetupResponseFull,
  type MfaEnableRequest,
  type MfaDisableRequest,
  type MfaVerifyRequestFull,
  type MfaStatusResponse,
  type MfaVerificationResponse,
  type MfaOperationResponse,

  // OAuth and Token types
  type OAuthSocialLoginRequest,
  type TenantLoginRequest,
  type TokenIntrospectionResponse,
  type TokenRevokeRequest,
  type TokenRevokeAllRequest,
  type TokenRevokeResponse,
  type TenantContextCreateRequest,
  type TenantInfo,
  type TenantContextResponse,
  type TenantContextRevokeRequest,
  type TenantContextAuditEntry,

  // Extended User types
  type UserProfileFull,
  type ProfileRequest,
  type UpdateEmailRequest,
  type UserDeviceFull,
  type AddDeviceRequest,
  type UserSearchRequest,
  type AddUserSubscriptionRequest,
  type AccountRecoveryRequest,
  type AccountRecoveryResponse,
  type CompleteRecoveryRequest,
  type UserAvatarFull,
  type CreateAvatarRequest,
  type AvatarPresignResponse,
  type MultipartPresignRequest,
  type MultipartPresignResponse,
  type MultipartCompleteRequest,
  type MultipartCompleteResponse,

  // Tenant types
  type TenantUserFull,
  type CreateTenantUserRequest,
  type ValidateTenantCodeRequest,
  type ValidateTenantCodeResponse,
  type SearchTenantRequest,
  type UpdateTenantUserOnboardingRequest,
  type UpdateTenantUserSalesRequest,
  type ResendInvitationRequest,

  // App types
  type App,
  type Block,
  type Service,
  type CreateAppRequest,
  type UpdateAppRequest,

  // Subscription types
  type SubscriptionModel,
  type UserSubscription,
  type CompanySubscription,

  // Geography types
  type Country,
  type State,
  type County,
  type City,
  type Currency,

  // Guest and related types
  type Guest,
  type MagicLink,
  type RefreshToken,
  type UserDevice,
  type TenantUser,
  type MailTemplate,
  type CreateMagicLinkRequest,
  type RegisterDeviceRequest,

  // JWKS types
  type JsonWebKey,
  type JwksResponse,
  type RsaKey,
  type CreateRsaKeyRequest,
  type RotateRsaKeyRequest,

  // OIDC types
  type OidcDiscovery,
  type OidcAuthorizeRequest,
  type OidcTokenRequest,
  type OidcTokenResponse,
  type OidcUserInfo,
} from './lib/types/index.js';

// Services (for advanced usage)
export {
  type AuthService,
  type UsersService,
  type RolesService,
  type ApiKeysService,
  type UpdateUserRequest,
  type UpdateProfileRequest,
  type CreateRoleRequest,
  type UpdateRoleRequest,
  type ApiKeyUsageStats,
  type ServiceTokensService,
  type MfaService,
  type OAuthService,
  type AvatarsService,
  type TenantsService,
  // Permissions service
  type PermissionsService,
  type CreatePermissionRequest,
  type UpdatePermissionRequest,
  // Apps and services
  type AppsService,
  type BlocksService,
  type ServicesRegistryService,
  // Subscriptions
  type SubscriptionModelsService,
  type UserSubscriptionsService,
  type CompanySubscriptionsService,
  type SubscribeRequest,
  // Geography
  type CountriesService,
  type StatesService,
  type CountiesService,
  type CitiesService,
  type CurrenciesService,
  // Guests and related
  type GuestsService,
  type MagicLinksService,
  type RefreshTokensService,
  type UserDevicesService,
  type TenantUsersService,
  type MailTemplatesService,
  // JWKS
  type JwksService,
  type AdminRsaKeysService,
  // OIDC
  type OidcService,
} from './lib/services/index.js';

// Mappers (for custom decoding)
export {
  userMapper,
  roleMapper,
  permissionMapper,
  userAvatarMapper,
  userProfileMapper,
  companyMapper,
  companyDetailMapper,
  companyBlockMapper,
  companyKeyMapper,
  tenantMapper,
  apiKeyMapper,
  apiKeyWithSecretMapper,
  serviceTokenMapper,
  serviceTokenWithJwtMapper,
} from './lib/mappers/index.js';
