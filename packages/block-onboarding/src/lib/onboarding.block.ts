import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createOnboardingsService,
  createFlowsService,
  createUserJourneysService,
  createUserIdentitiesService,
  createOnboardService,
  createMailTemplatesService,
  createRemarketingService,
  type OnboardingsService,
  type FlowsService,
  type UserJourneysService,
  type UserIdentitiesService,
  type OnboardService,
  type MailTemplatesService,
  type RemarketingService,
} from './services/index.js';

/**
 * Configuration for the Onboarding block.
 */
export interface OnboardingBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * User onboarding and journey management block interface.
 */
export interface OnboardingBlock {
  /** Onboarding definition management */
  onboardings: OnboardingsService;
  /** Onboarding flow management */
  flows: FlowsService;
  /** User journey tracking */
  userJourneys: UserJourneysService;
  /** User identity verification */
  userIdentities: UserIdentitiesService;
  /** Onboard action operations */
  onboard: OnboardService;
  /** Mail template management */
  mailTemplates: MailTemplatesService;
  /** Remarketing campaign management */
  remarketing: RemarketingService;
}

/**
 * Create the Onboarding block.
 *
 * @example
 * ```typescript
 * const block = createOnboardingBlock(transport, { appId: 'xxx' });
 * const flows = await block.flows.list({ page: 1 });
 * ```
 */
export function createOnboardingBlock(
  transport: Transport,
  config: OnboardingBlockConfig
): OnboardingBlock {
  return {
    onboardings: createOnboardingsService(transport, config),
    flows: createFlowsService(transport, config),
    userJourneys: createUserJourneysService(transport, config),
    userIdentities: createUserIdentitiesService(transport, config),
    onboard: createOnboardService(transport, config),
    mailTemplates: createMailTemplatesService(transport, config),
    remarketing: createRemarketingService(transport, config),
  };
}

export const onboardingBlockMetadata: BlockMetadata = {
  name: 'onboarding',
  version: '0.1.0',
  description: 'User onboarding, flows, journeys, and identity verification',
  resourceTypes: [
    'Onboarding',
    'Flow',
    'UserJourney',
    'UserIdentity',
    'MailTemplate',
  ],
};
