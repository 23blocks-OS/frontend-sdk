import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createOnboardingsService,
  createFlowsService,
  createUserJourneysService,
  createUserIdentitiesService,
  type OnboardingsService,
  type FlowsService,
  type UserJourneysService,
  type UserIdentitiesService,
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
  ],
};
