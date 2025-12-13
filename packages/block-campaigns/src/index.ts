// Block factory and metadata
export { createCampaignsBlock, campaignsBlockMetadata } from './lib/campaigns.block';
export type { CampaignsBlock, CampaignsBlockConfig } from './lib/campaigns.block';

// Types
export type {
  // Campaign types
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  ListCampaignsParams,
  CampaignResults,
  // Campaign Media types
  CampaignMedia,
  CreateCampaignMediaRequest,
  UpdateCampaignMediaRequest,
  ListCampaignMediaParams,
  CampaignMediaResults,
  // Landing Page types
  LandingPage,
  CreateLandingPageRequest,
  UpdateLandingPageRequest,
  ListLandingPagesParams,
  // Audience types
  Audience,
  AudienceMember,
  CreateAudienceRequest,
  UpdateAudienceRequest,
  ListAudiencesParams,
} from './lib/types';

// Services
export type {
  CampaignsService,
  CampaignMediaService,
  LandingPagesService,
  AudiencesService,
} from './lib/services';

export {
  createCampaignsService,
  createCampaignMediaService,
  createLandingPagesService,
  createAudiencesService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  campaignMapper,
  campaignMediaMapper,
  landingPageMapper,
  audienceMapper,
  audienceMemberMapper,
} from './lib/mappers';
