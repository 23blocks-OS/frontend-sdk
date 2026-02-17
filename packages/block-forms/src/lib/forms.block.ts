import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
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
  type FormsService,
  type FormSchemasService,
  type FormSchemaVersionsService,
  type FormInstancesService,
  type FormSetsService,
  type LandingsService,
  type SubscriptionsService,
  type AppointmentsService,
  type SurveysService,
  type ReferralsService,
  type MailTemplatesService,
  type ApplicationFormsService,
  type CrmSyncService,
} from './services/index.js';

/**
 * Configuration for the Forms block.
 */
export interface FormsBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Dynamic forms and submissions block interface.
 */
export interface FormsBlock {
  /** Form definitions (CRUD) */
  forms: FormsService;

  /** Form schemas nested under forms */
  schemas: FormSchemasService;

  /** Form schema versions nested under schemas */
  schemaVersions: FormSchemaVersionsService;

  /** App form instances nested under forms */
  instances: FormInstancesService;

  /** Form set templates for grouping forms */
  sets: FormSetsService;

  /** Landing form instances */
  landings: LandingsService;

  /** Subscription form instances */
  subscriptions: SubscriptionsService;

  /** Appointment form instances */
  appointments: AppointmentsService;

  /** Survey form instances */
  surveys: SurveysService;

  /** Referral form instances */
  referrals: ReferralsService;

  /** Mail templates */
  mailTemplates: MailTemplatesService;

  /** Application forms (magic link access) */
  applicationForms: ApplicationFormsService;

  /** CRM sync operations */
  crmSync: CrmSyncService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Forms block.
 *
 * @example
 * ```typescript
 * const block = createFormsBlock(transport, { appId: 'xxx' });
 * const forms = await block.forms.list({ page: 1 });
 * ```
 */
export function createFormsBlock(
  transport: Transport,
  config: FormsBlockConfig
): FormsBlock {
  return {
    forms: createFormsService(transport, config),
    schemas: createFormSchemasService(transport, config),
    schemaVersions: createFormSchemaVersionsService(transport, config),
    instances: createFormInstancesService(transport, config),
    sets: createFormSetsService(transport, config),
    landings: createLandingsService(transport, config),
    subscriptions: createSubscriptionsService(transport, config),
    appointments: createAppointmentsService(transport, config),
    surveys: createSurveysService(transport, config),
    referrals: createReferralsService(transport, config),
    mailTemplates: createMailTemplatesService(transport, config),
    applicationForms: createApplicationFormsService(transport, config),
    crmSync: createCrmSyncService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
  };
}

export const formsBlockMetadata: BlockMetadata = {
  name: 'forms',
  version: '0.2.0',
  description: 'Dynamic forms, schemas, versions, submissions, and form management with CRM integration',
  resourceTypes: [
    'Form',
    'FormSchema',
    'FormSchemaVersion',
    'FormInstance',
    'FormSet',
    'Landing',
    'Subscription',
    'Appointment',
    'Survey',
    'Referral',
    'MailTemplate',
    'ApplicationForm',
    'CrmSync',
  ],
};
