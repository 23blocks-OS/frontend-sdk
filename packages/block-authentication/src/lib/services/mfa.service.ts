import type { Transport } from '@23blocks/contracts';
import type {
  MfaSetupResponseFull,
  MfaEnableRequest,
  MfaDisableRequest,
  MfaVerifyRequestFull,
  MfaStatusResponse,
  MfaVerificationResponse,
  MfaOperationResponse,
} from '../types/index.js';

/**
 * MFA (Multi-Factor Authentication) service - setup, enable, disable, and verify TOTP-based MFA.
 */
export interface MfaService {
  /**
   * Setup MFA for a user. Generates a TOTP secret and QR code URI.
   *
   * @param userUniqueId - The user's UUID.
   * @param regenerate - If true, regenerates the secret even if one exists.
   * @returns MfaSetupResponseFull with `secret`, `qrCodeUri`, `backupCodes`, and `testCode`.
   */
  setup(userUniqueId: string, regenerate?: boolean): Promise<MfaSetupResponseFull>;

  /**
   * Enable MFA after setup. Requires a valid TOTP code to confirm the user has configured their authenticator.
   *
   * @returns MfaOperationResponse with `enabled: true` and a confirmation `message`.
   */
  enable(userUniqueId: string, request: MfaEnableRequest): Promise<MfaOperationResponse>;

  /**
   * Disable MFA. Requires the user's password for security verification.
   *
   * @returns MfaOperationResponse with `enabled: false` and a confirmation `message`.
   */
  disable(userUniqueId: string, request: MfaDisableRequest): Promise<MfaOperationResponse>;

  /**
   * Verify a TOTP code or backup code during sign-in.
   *
   * @param request - Provide either `code` (TOTP) or `backupCode`.
   * @returns MfaVerificationResponse with `valid` and `message`.
   */
  verify(userUniqueId: string, request: MfaVerifyRequestFull): Promise<MfaVerificationResponse>;

  /**
   * Get the MFA status for a user.
   *
   * @returns MfaStatusResponse with `enabled`, `setupRequired`, `backupCodesRemaining`, `lastUsedAt`.
   */
  status(userUniqueId: string): Promise<MfaStatusResponse>;
}

/**
 * Create the MFA service
 */
export function createMfaService(transport: Transport): MfaService {
  return {
    async setup(userUniqueId: string, regenerate?: boolean): Promise<MfaSetupResponseFull> {
      const response = await transport.post<{
        data: {
          attributes: {
            secret: string;
            qr_code_uri: string;
            backup_codes: string[];
            test_code: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/setup`, {
        regenerate: regenerate ? 'true' : undefined,
      });

      const attrs = response.data.attributes;
      return {
        secret: attrs.secret,
        qrCodeUri: attrs.qr_code_uri,
        backupCodes: attrs.backup_codes,
        testCode: attrs.test_code,
      };
    },

    async enable(userUniqueId: string, request: MfaEnableRequest): Promise<MfaOperationResponse> {
      const response = await transport.post<{
        data: {
          type: string;
          attributes: {
            enabled: boolean;
            message: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/enable`, {
        totp_code: request.totpCode,
      });

      return {
        enabled: response.data.attributes.enabled,
        message: response.data.attributes.message,
      };
    },

    async disable(userUniqueId: string, request: MfaDisableRequest): Promise<MfaOperationResponse> {
      const response = await transport.post<{
        data: {
          type: string;
          attributes: {
            enabled: boolean;
            message: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/disable`, {
        password: request.password,
      });

      return {
        enabled: response.data.attributes.enabled,
        message: response.data.attributes.message,
      };
    },

    async verify(userUniqueId: string, request: MfaVerifyRequestFull): Promise<MfaVerificationResponse> {
      const response = await transport.post<{
        data: {
          type: string;
          attributes: {
            valid: boolean;
            message: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/verify`, {
        code: request.code,
        backup_code: request.backupCode,
      });

      return {
        valid: response.data.attributes.valid,
        message: response.data.attributes.message,
      };
    },

    async status(userUniqueId: string): Promise<MfaStatusResponse> {
      const response = await transport.get<{
        data: {
          type: string;
          attributes: {
            enabled: boolean;
            setup_required: boolean;
            backup_codes_remaining: number;
            last_used_at: string | null;
          };
        };
      }>(`/users/${userUniqueId}/mfa/status`);

      return {
        enabled: response.data.attributes.enabled,
        setupRequired: response.data.attributes.setup_required,
        backupCodesRemaining: response.data.attributes.backup_codes_remaining,
        lastUsedAt: response.data.attributes.last_used_at,
      };
    },
  };
}
