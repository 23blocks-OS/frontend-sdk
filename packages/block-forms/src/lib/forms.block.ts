import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createFormsService,
  createFormSchemasService,
  createFormInstancesService,
  createFormSetsService,
  createLandingsService,
  createSubscriptionsService,
  createAppointmentsService,
  createSurveysService,
  createReferralsService,
  createMailTemplatesService,
  createPublicFormsService,
  type FormsService,
  type FormSchemasService,
  type FormInstancesService,
  type FormSetsService,
  type LandingsService,
  type SubscriptionsService,
  type AppointmentsService,
  type SurveysService,
  type ReferralsService,
  type MailTemplatesService,
  type PublicFormsService,
} from './services';

export interface FormsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface FormsBlock {
  forms: FormsService;
  schemas: FormSchemasService;
  instances: FormInstancesService;
  sets: FormSetsService;
  landings: LandingsService;
  subscriptions: SubscriptionsService;
  appointments: AppointmentsService;
  surveys: SurveysService;
  referrals: ReferralsService;
  mailTemplates: MailTemplatesService;
  publicForms: PublicFormsService;
}

export function createFormsBlock(
  transport: Transport,
  config: FormsBlockConfig
): FormsBlock {
  return {
    forms: createFormsService(transport, config),
    schemas: createFormSchemasService(transport, config),
    instances: createFormInstancesService(transport, config),
    sets: createFormSetsService(transport, config),
    landings: createLandingsService(transport, config),
    subscriptions: createSubscriptionsService(transport, config),
    appointments: createAppointmentsService(transport, config),
    surveys: createSurveysService(transport, config),
    referrals: createReferralsService(transport, config),
    mailTemplates: createMailTemplatesService(transport, config),
    publicForms: createPublicFormsService(transport, config),
  };
}

export const formsBlockMetadata: BlockMetadata = {
  name: 'forms',
  version: '0.1.0',
  description: 'Dynamic forms, schemas, submissions, and form management',
  resourceTypes: [
    'Form',
    'FormSchema',
    'FormInstance',
    'FormSet',
    'Landing',
    'Subscription',
    'Appointment',
    'Survey',
    'Referral',
    'MailTemplate',
    'PublicForm',
  ],
};
