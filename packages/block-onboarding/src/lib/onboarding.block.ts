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
} from './services';

export interface OnboardingBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface OnboardingBlock {
  onboardings: OnboardingsService;
  flows: FlowsService;
  userJourneys: UserJourneysService;
  userIdentities: UserIdentitiesService;
  onboard: OnboardService;
  mailTemplates: MailTemplatesService;
  remarketing: RemarketingService;
}

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
