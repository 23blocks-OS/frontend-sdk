// Block factory and metadata
export { createFormsBlock, formsBlockMetadata } from './lib/forms.block';
export type { FormsBlock, FormsBlockConfig } from './lib/forms.block';

// ============================================================================
// Types
// ============================================================================

// Form types
export type {
  Form,
  CreateFormRequest,
  UpdateFormRequest,
  ListFormsParams,
} from './lib/types/form';

// Form Schema types
export type {
  FormSchema,
  CreateFormSchemaRequest,
  UpdateFormSchemaRequest,
  ListFormSchemasParams,
} from './lib/types/form-schema';

// Form Schema Version types
export type {
  FormSchemaVersion,
  CreateFormSchemaVersionRequest,
  UpdateFormSchemaVersionRequest,
  ListFormSchemaVersionsParams,
} from './lib/types/form-schema-version';

// Form Instance types
export type {
  FormInstance,
  CreateFormInstanceRequest,
  UpdateFormInstanceRequest,
  SubmitFormInstanceRequest,
  ListFormInstancesParams,
} from './lib/types/form-instance';

// Form Set types
export type {
  FormSet,
  FormReference,
  CreateFormSetRequest,
  UpdateFormSetRequest,
  ListFormSetsParams,
  FormSetMatchRequest,
  FormSetMatchResult,
  FormSetAutoAssignRequest,
} from './lib/types/form-set';

// Landing types
export type {
  Landing,
  CreateLandingRequest,
  UpdateLandingRequest,
  ListLandingsParams,
} from './lib/types/landing';

// Subscription types
export type {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  ListSubscriptionsParams,
} from './lib/types/subscription';

// Appointment types
export type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  ListAppointmentsParams,
  AppointmentReportRequest,
  AppointmentReportSummary,
} from './lib/types/appointment';

// Survey types
export type {
  Survey,
  SurveyStatus,
  CreateSurveyRequest,
  UpdateSurveyRequest,
  UpdateSurveyStatusRequest,
  ListSurveysParams,
} from './lib/types/survey';

// Referral types
export type {
  Referral,
  CreateReferralRequest,
  UpdateReferralRequest,
  ListReferralsParams,
} from './lib/types/referral';

// Mail Template types
export type {
  MailTemplate,
  CreateMailTemplateRequest,
  UpdateMailTemplateRequest,
  ListMailTemplatesParams,
} from './lib/types/mail-template';

// Public Form types
export type {
  PublicForm,
  PublicFormSubmission,
  SubmitPublicFormRequest,
  SavePublicFormDraftRequest,
} from './lib/types/public-form';

// CRM Sync types
export type {
  CrmSyncResult,
  CrmSyncBatchRequest,
  CrmSyncBatchResult,
  CrmConnectionStatus,
  CrmSyncStatus,
} from './lib/types/crm-sync';

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
  PublicFormsService,
  CrmSyncService,
} from './lib/services';

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
  createPublicFormsService,
  createCrmSyncService,
} from './lib/services';

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
  publicFormMapper,
} from './lib/mappers';
