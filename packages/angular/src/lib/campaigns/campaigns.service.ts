import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createCampaignsBlock,
  type CampaignsBlock,
  type CampaignsBlockConfig,
  type Campaign,
  type CreateCampaignRequest,
  type UpdateCampaignRequest,
  type ListCampaignsParams,
  type CampaignResults,
  type CampaignMedia,
  type CreateCampaignMediaRequest,
  type UpdateCampaignMediaRequest,
  type ListCampaignMediaParams,
  type CampaignMediaResults,
  type LandingPage,
  type CreateLandingPageRequest,
  type UpdateLandingPageRequest,
  type ListLandingPagesParams,
  type Audience,
  type AudienceMember,
  type CreateAudienceRequest,
  type UpdateAudienceRequest,
  type ListAudiencesParams,
} from '@23blocks/block-campaigns';
import { TRANSPORT, CAMPAIGNS_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Campaigns block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class CampaignsComponent {
 *   constructor(private campaigns: CampaignsService) {}
 *
 *   loadCampaigns() {
 *     this.campaigns.listCampaigns({ page: 1, perPage: 10 }).subscribe({
 *       next: (result) => console.log('Campaigns:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CampaignsService {
  private readonly block: CampaignsBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(CAMPAIGNS_CONFIG) config: CampaignsBlockConfig
  ) {
    this.block = createCampaignsBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Campaigns Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCampaigns(params?: ListCampaignsParams): Observable<PageResult<Campaign>> {
    return from(this.block.campaigns.list(params));
  }

  getCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.block.campaigns.get(uniqueId));
  }

  createCampaign(data: CreateCampaignRequest): Observable<Campaign> {
    return from(this.block.campaigns.create(data));
  }

  updateCampaign(uniqueId: string, data: UpdateCampaignRequest): Observable<Campaign> {
    return from(this.block.campaigns.update(uniqueId, data));
  }

  deleteCampaign(uniqueId: string): Observable<void> {
    return from(this.block.campaigns.delete(uniqueId));
  }

  startCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.block.campaigns.start(uniqueId));
  }

  pauseCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.block.campaigns.pause(uniqueId));
  }

  stopCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.block.campaigns.stop(uniqueId));
  }

  getCampaignResults(uniqueId: string): Observable<CampaignResults> {
    return from(this.block.campaigns.getResults(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Campaign Media Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMedia(params?: ListCampaignMediaParams): Observable<PageResult<CampaignMedia>> {
    return from(this.block.media.list(params));
  }

  getMedia(uniqueId: string): Observable<CampaignMedia> {
    return from(this.block.media.get(uniqueId));
  }

  createMedia(data: CreateCampaignMediaRequest): Observable<CampaignMedia> {
    return from(this.block.media.create(data));
  }

  updateMedia(uniqueId: string, data: UpdateCampaignMediaRequest): Observable<CampaignMedia> {
    return from(this.block.media.update(uniqueId, data));
  }

  deleteMedia(uniqueId: string): Observable<void> {
    return from(this.block.media.delete(uniqueId));
  }

  listMediaByCampaign(campaignUniqueId: string): Observable<CampaignMedia[]> {
    return from(this.block.media.listByCampaign(campaignUniqueId));
  }

  getMediaResults(uniqueId: string): Observable<CampaignMediaResults> {
    return from(this.block.media.getResults(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Landing Pages Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLandingPages(params?: ListLandingPagesParams): Observable<PageResult<LandingPage>> {
    return from(this.block.landingPages.list(params));
  }

  getLandingPage(uniqueId: string): Observable<LandingPage> {
    return from(this.block.landingPages.get(uniqueId));
  }

  createLandingPage(data: CreateLandingPageRequest): Observable<LandingPage> {
    return from(this.block.landingPages.create(data));
  }

  updateLandingPage(uniqueId: string, data: UpdateLandingPageRequest): Observable<LandingPage> {
    return from(this.block.landingPages.update(uniqueId, data));
  }

  deleteLandingPage(uniqueId: string): Observable<void> {
    return from(this.block.landingPages.delete(uniqueId));
  }

  publishLandingPage(uniqueId: string): Observable<LandingPage> {
    return from(this.block.landingPages.publish(uniqueId));
  }

  unpublishLandingPage(uniqueId: string): Observable<LandingPage> {
    return from(this.block.landingPages.unpublish(uniqueId));
  }

  getLandingPageBySlug(slug: string): Observable<LandingPage> {
    return from(this.block.landingPages.getBySlug(slug));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Audiences Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAudiences(params?: ListAudiencesParams): Observable<PageResult<Audience>> {
    return from(this.block.audiences.list(params));
  }

  getAudience(uniqueId: string): Observable<Audience> {
    return from(this.block.audiences.get(uniqueId));
  }

  createAudience(data: CreateAudienceRequest): Observable<Audience> {
    return from(this.block.audiences.create(data));
  }

  updateAudience(uniqueId: string, data: UpdateAudienceRequest): Observable<Audience> {
    return from(this.block.audiences.update(uniqueId, data));
  }

  deleteAudience(uniqueId: string): Observable<void> {
    return from(this.block.audiences.delete(uniqueId));
  }

  getAudienceMembers(uniqueId: string): Observable<AudienceMember[]> {
    return from(this.block.audiences.getMembers(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): CampaignsBlock {
    return this.block;
  }
}
