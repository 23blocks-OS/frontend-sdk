// Block factory and metadata
export { createFormsBlock, formsBlockMetadata } from './lib/forms.block.js';
export type { FormsBlock, FormsBlockConfig } from './lib/forms.block.js';

// ============================================================================
// Types
// ============================================================================

// Form types
export type {
  Form,
  CreateFormRequest,
  UpdateFormRequest,
  ListFormsParams,
} from './lib/types/form.js';

// Form Schema types
export type {
  FormSchema,
  CreateFormSchemaRequest,
  UpdateFormSchemaRequest,
  ListFormSchemasParams,
} from './lib/types/form-schema.js';

// Form Schema Version types
export type {
  FormSchemaVersion,
  CreateFormSchemaVersionRequest,
  UpdateFormSchemaVersionRequest,
  ListFormSchemaVersionsParams,
} from './lib/types/form-schema-version.js';

// Form Instance types
export type {
  FormInstance,
  CreateFormInstanceRequest,
  UpdateFormInstanceRequest,
  ListFormInstancesParams,
} from './lib/types/form-instance.js';

// Form Set types
export type {
  FormSet,
  FormSetItem,
  CreateFormSetRequest,
  UpdateFormSetRequest,
  ListFormSetsParams,
  FormSetMatchRequest,
  FormSetMatchResult,
  FormSetAutoAssignRequest,
} from './lib/types/form-set.js';

// Landing types
export type {
  Landing,
  CreateLandingRequest,
  UpdateLandingRequest,
  ListLandingsParams,
} from './lib/types/landing.js';

// Subscription types
export type {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  ListSubscriptionsParams,
} from './lib/types/subscription.js';

// Appointment types
export type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  ListAppointmentsParams,
  AppointmentReportRequest,
  AppointmentReportSummary,
} from './lib/types/appointment.js';

// Survey types
export type {
  Survey,
  SurveyStatus,
  CreateSurveyRequest,
  UpdateSurveyRequest,
  UpdateSurveyStatusRequest,
  ListSurveysParams,
} from './lib/types/survey.js';

// Referral types
export type {
  Referral,
  CreateReferralRequest,
  UpdateReferralRequest,
  ListReferralsParams,
} from './lib/types/referral.js';

// Mail Template types
export type {
  MailTemplate,
  CreateMailTemplateRequest,
  UpdateMailTemplateRequest,
  ListMailTemplatesParams,
} from './lib/types/mail-template.js';

// Application Form types
export type {
  ApplicationForm,
  ApplicationFormSubmission,
  ApplicationFormDraft,
  ApplicationFormResponse,
  // OTP Verification types
  VerificationStatus,
  SendOtpResponse,
  VerifyOtpRequest,
  OtpErrorCode,
  OtpError,
} from './lib/types/application-form.js';

// CRM Sync types
export type {
  CrmSyncResult,
  CrmSyncBatchRequest,
  CrmSyncBatchResult,
  CrmConnectionStatus,
  CrmSyncStatus,
} from './lib/types/crm-sync.js';

// ============================================================================
// Services
// ============================================================================

export type {
  FormsService,
  FormSchemasService,
  FormSchemaVersionsService,
  FormInstancesService,
  FormSetsService,
  LandingsService,
  SubscriptionsService,
  AppointmentsService,
  SurveysService,
  ReferralsService,
  MailTemplatesService,
  ApplicationFormsService,
  CrmSyncService,
} from './lib/services/index.js';

export {
  createFormsService,
  createFormSchemasService,
  createFormSchemaVersionsService,
  createFormInstancesService,
  createFormSetsService,
  createLandingsService,
  createSubscriptionsService,
  createAppointmentsService,
  createSurveysService,
  createReferralsService,
  createMailTemplatesService,
  createApplicationFormsService,
  createCrmSyncService,
} from './lib/services/index.js';

// ============================================================================
// Mappers (for advanced use cases)
// ============================================================================

export {
  formMapper,
  formSchemaMapper,
  formSchemaVersionMapper,
  formInstanceMapper,
  formSetMapper,
  landingMapper,
  subscriptionMapper,
  appointmentMapper,
  surveyMapper,
  referralMapper,
  mailTemplateMapper,
  applicationFormMapper,
  mapSendOtpResponse,
} from './lib/mappers/index.js';
