import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createCampaignsService,
  createCampaignMediaService,
  createLandingPagesService,
  createAudiencesService,
  type CampaignsService,
  type CampaignMediaService,
  type LandingPagesService,
  type AudiencesService,
} from './services';

export interface CampaignsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface CampaignsBlock {
  campaigns: CampaignsService;
  media: CampaignMediaService;
  landingPages: LandingPagesService;
  audiences: AudiencesService;
}

export function createCampaignsBlock(
  transport: Transport,
  config: CampaignsBlockConfig
): CampaignsBlock {
  return {
    campaigns: createCampaignsService(transport, config),
    media: createCampaignMediaService(transport, config),
    landingPages: createLandingPagesService(transport, config),
    audiences: createAudiencesService(transport, config),
  };
}

export const campaignsBlockMetadata: BlockMetadata = {
  name: 'campaigns',
  version: '0.1.0',
  description: 'Marketing campaigns, media assets, landing pages, and audience management',
  resourceTypes: [
    'Campaign',
    'CampaignMedia',
    'LandingPage',
    'Audience',
    'AudienceMember',
  ],
};
