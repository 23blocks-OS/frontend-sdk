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
} from './services/index.js';

/**
 * Configuration for the Campaigns block.
 */
export interface CampaignsBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Marketing campaigns block interface.
 */
export interface CampaignsBlock {
  /** Core campaign CRUD operations */
  campaigns: CampaignsService;
  /** Campaign media asset management */
  campaignMedia: CampaignMediaService;
  /** Landing page management */
  landingPages: LandingPagesService;
  /** Audience segment management */
  audiences: AudiencesService;
  /** Landing page template management */
  landingTemplates: LandingTemplatesService;
  /** Campaign target management */
  targets: CampaignTargetsService;
  /** Campaign result tracking */
  results: CampaignResultsService;
  /** Campaign market management */
  markets: CampaignMarketsService;
  /** Campaign location management */
  locations: CampaignLocationsService;
  /** Campaign template management */
  templates: CampaignTemplatesService;
  /** Campaign media result tracking */
  mediaResults: CampaignMediaResultsService;
  /** Media channel management */
  media: MediaService;
}

/**
 * Create the Campaigns block.
 *
 * @example
 * ```typescript
 * const block = createCampaignsBlock(transport, { appId: 'xxx' });
 * const campaigns = await block.campaigns.list({ page: 1 });
 * ```
 */
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
