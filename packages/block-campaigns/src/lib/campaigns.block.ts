import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createCampaignsService,
  createCampaignMediaService,
  createLandingPagesService,
  createAudiencesService,
  createLandingTemplatesService,
  createCampaignTargetsService,
  createCampaignResultsService,
  createCampaignMarketsService,
  createCampaignLocationsService,
  createCampaignTemplatesService,
  createCampaignMediaResultsService,
  createMediaService,
  type CampaignsService,
  type CampaignMediaService,
  type LandingPagesService,
  type AudiencesService,
  type LandingTemplatesService,
  type CampaignTargetsService,
  type CampaignResultsService,
  type CampaignMarketsService,
  type CampaignLocationsService,
  type CampaignTemplatesService,
  type CampaignMediaResultsService,
  type MediaService,
} from './services';

export interface CampaignsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface CampaignsBlock {
  campaigns: CampaignsService;
  campaignMedia: CampaignMediaService;
  landingPages: LandingPagesService;
  audiences: AudiencesService;
  landingTemplates: LandingTemplatesService;
  targets: CampaignTargetsService;
  results: CampaignResultsService;
  markets: CampaignMarketsService;
  locations: CampaignLocationsService;
  templates: CampaignTemplatesService;
  mediaResults: CampaignMediaResultsService;
  media: MediaService;
}

export function createCampaignsBlock(
  transport: Transport,
  config: CampaignsBlockConfig
): CampaignsBlock {
  return {
    campaigns: createCampaignsService(transport, config),
    campaignMedia: createCampaignMediaService(transport, config),
    landingPages: createLandingPagesService(transport, config),
    audiences: createAudiencesService(transport, config),
    landingTemplates: createLandingTemplatesService(transport, config),
    targets: createCampaignTargetsService(transport, config),
    results: createCampaignResultsService(transport, config),
    markets: createCampaignMarketsService(transport, config),
    locations: createCampaignLocationsService(transport, config),
    templates: createCampaignTemplatesService(transport, config),
    mediaResults: createCampaignMediaResultsService(transport, config),
    media: createMediaService(transport, config),
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
    'LandingTemplate',
    'CampaignTarget',
    'CampaignResult',
    'CampaignMarket',
    'CampaignLocation',
    'CampaignTemplate',
    'TemplateDetail',
    'CampaignMediaResult',
    'Medium',
  ],
};
