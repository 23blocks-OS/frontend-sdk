// @ts-nocheck
import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createFormsBlock,
  type FormsBlock,
  type FormsBlockConfig,
  type Form,
  type CreateFormRequest,
  type UpdateFormRequest,
  type ListFormsParams,
  type FormSchema,
  type CreateFormSchemaRequest,
  type UpdateFormSchemaRequest,
  type ListFormSchemasParams,
  type FormSchemaVersion,
  type CreateFormSchemaVersionRequest,
  type UpdateFormSchemaVersionRequest,
  type ListFormSchemaVersionsParams,
  type FormInstance,
  type CreateFormInstanceRequest,
  type UpdateFormInstanceRequest,
  type SubmitFormInstanceRequest,
  type ListFormInstancesParams,
  type FormSet,
  type CreateFormSetRequest,
  type UpdateFormSetRequest,
  type ListFormSetsParams,
  type Landing,
  type CreateLandingRequest,
  type UpdateLandingRequest,
  type ListLandingsParams,
  type Subscription,
  type CreateSubscriptionRequest,
  type UpdateSubscriptionRequest,
  type ListSubscriptionsParams,
  type Appointment,
  type CreateAppointmentRequest,
  type UpdateAppointmentRequest,
  type ListAppointmentsParams,
  type AppointmentReportRequest,
  type AppointmentReportSummary,
  type Survey,
  type SurveyStatus,
  type CreateSurveyRequest,
  type UpdateSurveyRequest,
  type UpdateSurveyStatusRequest,
  type ListSurveysParams,
  type Referral,
  type CreateReferralRequest,
  type UpdateReferralRequest,
  type ListReferralsParams,
  type MailTemplate,
  type CreateMailTemplateRequest,
  type UpdateMailTemplateRequest,
  type ListMailTemplatesParams,
  type ApplicationForm,
  type ApplicationFormSubmission,
  type ApplicationFormDraft,
  type ApplicationFormResponse,
  type SendOtpResponse,
  type VerifyOtpRequest,
  type CrmSyncResult,
  type CrmSyncBatchRequest,
  type CrmSyncBatchResult,
  type CrmConnectionStatus,
  type CrmSyncStatus,
} from '@23blocks/block-forms';
import { TRANSPORT, FORMS_TRANSPORT, FORMS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Forms block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class FormComponent {
 *   constructor(private formsService: FormsService) {}
 *
 *   loadForms() {
 *     this.formsService.listForms().subscribe({
 *       next: (result) => console.log('Forms:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FormsService {
  private readonly block: FormsBlock | null;

  constructor(
    @Optional() @Inject(FORMS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(FORMS_CONFIG) config: FormsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createFormsBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): FormsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] FormsService is not configured. ' +
        "Add 'urls.forms' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Forms Service
  // ───────────────────────────────────────────────────────────────────────────

  listForms(params?: ListFormsParams): Observable<PageResult<Form>> {
    return from(this.ensureConfigured().forms.list(params));
  }

  getForm(uniqueId: string): Observable<Form> {
    return from(this.ensureConfigured().forms.get(uniqueId));
  }

  createForm(data: CreateFormRequest): Observable<Form> {
    return from(this.ensureConfigured().forms.create(data));
  }

  updateForm(uniqueId: string, data: UpdateFormRequest): Observable<Form> {
    return from(this.ensureConfigured().forms.update(uniqueId, data));
  }

  deleteForm(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().forms.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Form Schemas Service
  // ───────────────────────────────────────────────────────────────────────────

  listFormSchemas(params?: ListFormSchemasParams): Observable<PageResult<FormSchema>> {
    return from(this.ensureConfigured().schemas.list(params));
  }

  getFormSchema(uniqueId: string): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.get(uniqueId));
  }

  createFormSchema(data: CreateFormSchemaRequest): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.create(data));
  }

  updateFormSchema(uniqueId: string, data: UpdateFormSchemaRequest): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.update(uniqueId, data));
  }

  deleteFormSchema(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().schemas.delete(uniqueId));
  }

  getLatestFormSchemaVersion(formUniqueId: string): Observable<FormSchema> {
    return from(this.ensureConfigured().schemas.getLatestVersion(formUniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Form Schema Versions Service
  // ───────────────────────────────────────────────────────────────────────────

  listFormSchemaVersions(formSchemaUniqueId: string, params?: ListFormSchemaVersionsParams): Observable<PageResult<FormSchemaVersion>> {
    return from(this.ensureConfigured().schemaVersions.list(formSchemaUniqueId, params));
  }

  getFormSchemaVersion(formSchemaUniqueId: string, uniqueId: string): Observable<FormSchemaVersion> {
    return from(this.ensureConfigured().schemaVersions.get(formSchemaUniqueId, uniqueId));
  }

  createFormSchemaVersion(formSchemaUniqueId: string, data: CreateFormSchemaVersionRequest): Observable<FormSchemaVersion> {
    return from(this.ensureConfigured().schemaVersions.create(formSchemaUniqueId, data));
  }

  updateFormSchemaVersion(formSchemaUniqueId: string, uniqueId: string, data: UpdateFormSchemaVersionRequest): Observable<FormSchemaVersion> {
    return from(this.ensureConfigured().schemaVersions.update(formSchemaUniqueId, uniqueId, data));
  }

  deleteFormSchemaVersion(formSchemaUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().schemaVersions.delete(formSchemaUniqueId, uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Form Instances Service
  // ───────────────────────────────────────────────────────────────────────────

  listFormInstances(params?: ListFormInstancesParams): Observable<PageResult<FormInstance>> {
    return from(this.ensureConfigured().instances.list(params));
  }

  getFormInstance(uniqueId: string): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.get(uniqueId));
  }

  createFormInstance(data: CreateFormInstanceRequest): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.create(data));
  }

  updateFormInstance(uniqueId: string, data: UpdateFormInstanceRequest): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.update(uniqueId, data));
  }

  deleteFormInstance(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().instances.delete(uniqueId));
  }

  submitFormInstance(data: SubmitFormInstanceRequest): Observable<FormInstance> {
    return from(this.ensureConfigured().instances.submit(data));
  }

  listFormInstancesByUser(userUniqueId: string, params?: ListFormInstancesParams): Observable<PageResult<FormInstance>> {
    return from(this.ensureConfigured().instances.listByUser(userUniqueId, params));
  }

  listFormInstancesBySchema(formSchemaUniqueId: string, params?: ListFormInstancesParams): Observable<PageResult<FormInstance>> {
    return from(this.ensureConfigured().instances.listBySchema(formSchemaUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Form Sets Service
  // ───────────────────────────────────────────────────────────────────────────

  listFormSets(params?: ListFormSetsParams): Observable<PageResult<FormSet>> {
    return from(this.ensureConfigured().sets.list(params));
  }

  getFormSet(uniqueId: string): Observable<FormSet> {
    return from(this.ensureConfigured().sets.get(uniqueId));
  }

  createFormSet(data: CreateFormSetRequest): Observable<FormSet> {
    return from(this.ensureConfigured().sets.create(data));
  }

  updateFormSet(uniqueId: string, data: UpdateFormSetRequest): Observable<FormSet> {
    return from(this.ensureConfigured().sets.update(uniqueId, data));
  }

  deleteFormSet(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().sets.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Landings Service
  // ───────────────────────────────────────────────────────────────────────────

  listLandings(formUniqueId: string, params?: ListLandingsParams): Observable<PageResult<Landing>> {
    return from(this.ensureConfigured().landings.list(formUniqueId, params));
  }

  getLanding(formUniqueId: string, uniqueId: string): Observable<Landing> {
    return from(this.ensureConfigured().landings.get(formUniqueId, uniqueId));
  }

  submitLanding(formUniqueId: string, data: CreateLandingRequest): Observable<Landing> {
    return from(this.ensureConfigured().landings.submit(formUniqueId, data));
  }

  updateLanding(formUniqueId: string, uniqueId: string, data: UpdateLandingRequest): Observable<Landing> {
    return from(this.ensureConfigured().landings.update(formUniqueId, uniqueId, data));
  }

  deleteLanding(formUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().landings.delete(formUniqueId, uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Subscriptions Service
  // ───────────────────────────────────────────────────────────────────────────

  listSubscriptions(formUniqueId: string, params?: ListSubscriptionsParams): Observable<PageResult<Subscription>> {
    return from(this.ensureConfigured().subscriptions.list(formUniqueId, params));
  }

  getSubscription(formUniqueId: string, uniqueId: string): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.get(formUniqueId, uniqueId));
  }

  submitSubscription(formUniqueId: string, data: CreateSubscriptionRequest): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.submit(formUniqueId, data));
  }

  updateSubscription(formUniqueId: string, uniqueId: string, data: UpdateSubscriptionRequest): Observable<Subscription> {
    return from(this.ensureConfigured().subscriptions.update(formUniqueId, uniqueId, data));
  }

  deleteSubscription(formUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().subscriptions.delete(formUniqueId, uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Appointments Service
  // ───────────────────────────────────────────────────────────────────────────

  listAppointments(formUniqueId: string, params?: ListAppointmentsParams): Observable<PageResult<Appointment>> {
    return from(this.ensureConfigured().appointments.list(formUniqueId, params));
  }

  getAppointment(formUniqueId: string, uniqueId: string): Observable<Appointment> {
    return from(this.ensureConfigured().appointments.get(formUniqueId, uniqueId));
  }

  createAppointment(formUniqueId: string, data: CreateAppointmentRequest): Observable<Appointment> {
    return from(this.ensureConfigured().appointments.create(formUniqueId, data));
  }

  updateAppointment(formUniqueId: string, uniqueId: string, data: UpdateAppointmentRequest): Observable<Appointment> {
    return from(this.ensureConfigured().appointments.update(formUniqueId, uniqueId, data));
  }

  deleteAppointment(formUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().appointments.delete(formUniqueId, uniqueId));
  }

  confirmAppointment(formUniqueId: string, uniqueId: string): Observable<Appointment> {
    return from(this.ensureConfigured().appointments.confirm(formUniqueId, uniqueId));
  }

  cancelAppointment(formUniqueId: string, uniqueId: string): Observable<Appointment> {
    return from(this.ensureConfigured().appointments.cancel(formUniqueId, uniqueId));
  }

  getAppointmentReportList(data: AppointmentReportRequest): Observable<Appointment[]> {
    return from(this.ensureConfigured().appointments.reportList(data));
  }

  getAppointmentReportSummary(data: AppointmentReportRequest): Observable<AppointmentReportSummary> {
    return from(this.ensureConfigured().appointments.reportSummary(data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Surveys Service
  // ───────────────────────────────────────────────────────────────────────────

  listSurveys(formUniqueId: string, params?: ListSurveysParams): Observable<PageResult<Survey>> {
    return from(this.ensureConfigured().surveys.list(formUniqueId, params));
  }

  listSurveysByStatus(formUniqueId: string, status: SurveyStatus, params?: ListSurveysParams): Observable<PageResult<Survey>> {
    return from(this.ensureConfigured().surveys.listByStatus(formUniqueId, status, params));
  }

  getSurvey(formUniqueId: string, uniqueId: string): Observable<Survey> {
    return from(this.ensureConfigured().surveys.get(formUniqueId, uniqueId));
  }

  createSurvey(formUniqueId: string, data: CreateSurveyRequest): Observable<Survey> {
    return from(this.ensureConfigured().surveys.create(formUniqueId, data));
  }

  updateSurvey(formUniqueId: string, uniqueId: string, data: UpdateSurveyRequest): Observable<Survey> {
    return from(this.ensureConfigured().surveys.update(formUniqueId, uniqueId, data));
  }

  deleteSurvey(formUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().surveys.delete(formUniqueId, uniqueId));
  }

  updateSurveyStatus(formUniqueId: string, uniqueId: string, data: UpdateSurveyStatusRequest): Observable<Survey> {
    return from(this.ensureConfigured().surveys.updateStatus(formUniqueId, uniqueId, data));
  }

  resendSurveyMagicLink(formUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().surveys.resendMagicLink(formUniqueId, uniqueId));
  }

  listSurveysByUser(userUniqueId: string, params?: ListSurveysParams): Observable<PageResult<Survey>> {
    return from(this.ensureConfigured().surveys.listByUser(userUniqueId, params));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Referrals Service
  // ───────────────────────────────────────────────────────────────────────────

  listReferrals(formUniqueId: string, params?: ListReferralsParams): Observable<PageResult<Referral>> {
    return from(this.ensureConfigured().referrals.list(formUniqueId, params));
  }

  getReferral(formUniqueId: string, uniqueId: string): Observable<Referral> {
    return from(this.ensureConfigured().referrals.get(formUniqueId, uniqueId));
  }

  createReferral(formUniqueId: string, data: CreateReferralRequest): Observable<Referral> {
    return from(this.ensureConfigured().referrals.create(formUniqueId, data));
  }

  updateReferral(formUniqueId: string, uniqueId: string, data: UpdateReferralRequest): Observable<Referral> {
    return from(this.ensureConfigured().referrals.update(formUniqueId, uniqueId, data));
  }

  deleteReferral(formUniqueId: string, uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().referrals.delete(formUniqueId, uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Mail Templates Service
  // ───────────────────────────────────────────────────────────────────────────

  listMailTemplates(params?: ListMailTemplatesParams): Observable<PageResult<MailTemplate>> {
    return from(this.ensureConfigured().mailTemplates.list(params));
  }

  getMailTemplate(uniqueId: string): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.get(uniqueId));
  }

  createMailTemplate(data: CreateMailTemplateRequest): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.create(data));
  }

  updateMailTemplate(uniqueId: string, data: UpdateMailTemplateRequest): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.update(uniqueId, data));
  }

  deleteMailTemplate(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().mailTemplates.delete(uniqueId));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Application Forms Service (magic link access)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Get public form via magic link.
   * If OTP verification is required, returns form with verificationStatus: 'pending'
   * and limited fields (no schema/uiSchema until verified).
   */
  getApplicationForm(urlId: string): Observable<ApplicationForm> {
    return from(this.ensureConfigured().applicationForms.get(urlId));
  }

  submitApplicationForm(urlId: string, data: ApplicationFormSubmission): Observable<ApplicationFormResponse> {
    return from(this.ensureConfigured().applicationForms.submit(urlId, data));
  }

  saveApplicationFormDraft(urlId: string, data: ApplicationFormDraft): Observable<ApplicationFormResponse> {
    return from(this.ensureConfigured().applicationForms.draft(urlId, data));
  }

  /**
   * Send OTP verification code to user's email.
   * @throws Error with code RATE_LIMITED if called too frequently (60s cooldown)
   * @throws Error with code ALREADY_VERIFIED if form is already verified
   * @throws Error with code OTP_NOT_REQUIRED if form doesn't require OTP
   */
  sendApplicationFormOtp(urlId: string): Observable<SendOtpResponse> {
    return from(this.ensureConfigured().applicationForms.sendOtp(urlId));
  }

  /**
   * Verify OTP code and get full form access.
   * On success, returns full form with schema and fields.
   * @throws Error with code INVALID_CODE if code is wrong (includes attemptsRemaining)
   * @throws Error with code CODE_EXPIRED if code has expired (10 min lifetime)
   * @throws Error with code ATTEMPTS_EXCEEDED if max attempts (5) reached
   */
  verifyApplicationFormOtp(urlId: string, data: VerifyOtpRequest): Observable<ApplicationForm> {
    return from(this.ensureConfigured().applicationForms.verifyOtp(urlId, data));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // CRM Sync Service
  // ───────────────────────────────────────────────────────────────────────────

  syncLandingToCrm(uniqueId: string): Observable<CrmSyncResult> {
    return from(this.ensureConfigured().crmSync.syncLanding(uniqueId));
  }

  syncSubscriptionToCrm(uniqueId: string): Observable<CrmSyncResult> {
    return from(this.ensureConfigured().crmSync.syncSubscription(uniqueId));
  }

  syncAppointmentToCrm(uniqueId: string): Observable<CrmSyncResult> {
    return from(this.ensureConfigured().crmSync.syncAppointment(uniqueId));
  }

  batchSyncToCrm(data: CrmSyncBatchRequest): Observable<CrmSyncBatchResult> {
    return from(this.ensureConfigured().crmSync.batchSync(data));
  }

  retryFailedCrmSync(): Observable<CrmSyncBatchResult> {
    return from(this.ensureConfigured().crmSync.retryFailed());
  }

  testCrmConnection(): Observable<CrmConnectionStatus> {
    return from(this.ensureConfigured().crmSync.testConnection());
  }

  getCrmSyncStatus(): Observable<CrmSyncStatus> {
    return from(this.ensureConfigured().crmSync.status());
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Direct Block Access
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying FormsBlock for advanced operations
   */
  get formsBlock(): FormsBlock {
    return this.ensureConfigured();
  }
}
