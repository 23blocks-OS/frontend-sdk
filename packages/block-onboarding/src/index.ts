// Block factory and metadata
export { createOnboardingBlock, onboardingBlockMetadata } from './lib/onboarding.block';
export type { OnboardingBlock, OnboardingBlockConfig } from './lib/onboarding.block';

// Types
export type {
  // Onboarding types
  Onboarding,
  CreateOnboardingRequest,
  UpdateOnboardingRequest,
  ListOnboardingsParams,
  // Flow types
  Flow,
  CreateFlowRequest,
  UpdateFlowRequest,
  ListFlowsParams,
  // User Journey types
  UserJourney,
  UserJourneyStatus,
  StartJourneyRequest,
  CompleteStepRequest,
  ListUserJourneysParams,
  // User Identity types
  UserIdentity,
  CreateUserIdentityRequest,
  VerifyUserIdentityRequest,
  ListUserIdentitiesParams,
} from './lib/types';

// Services
export type {
  OnboardingsService,
  FlowsService,
  UserJourneysService,
  UserIdentitiesService,
} from './lib/services';

export {
  createOnboardingsService,
  createFlowsService,
  createUserJourneysService,
  createUserIdentitiesService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  onboardingMapper,
  flowMapper,
  userJourneyMapper,
  userIdentityMapper,
} from './lib/mappers';
