import { Injectable, Inject, Optional } from '@angular/core';
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
import { TRANSPORT, CAMPAIGNS_TRANSPORT, CAMPAIGNS_CONFIG } from '../tokens.js';

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
  private readonly block: CampaignsBlock | null;

  constructor(
    @Optional() @Inject(CAMPAIGNS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CAMPAIGNS_CONFIG) config: CampaignsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createCampaignsBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): CampaignsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] CampaignsService is not configured. ' +
        "Add 'urls.campaigns' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Campaigns Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCampaigns(params?: ListCampaignsParams): Observable<PageResult<Campaign>> {
    return from(this.ensureConfigured().campaigns.list(params));
  }

  getCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.ensureConfigured().campaigns.get(uniqueId));
  }

  createCampaign(data: CreateCampaignRequest): Observable<Campaign> {
    return from(this.ensureConfigured().campaigns.create(data));
  }

  updateCampaign(uniqueId: string, data: UpdateCampaignRequest): Observable<Campaign> {
    return from(this.ensureConfigured().campaigns.update(uniqueId, data));
  }

  deleteCampaign(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().campaigns.delete(uniqueId));
  }

  startCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.ensureConfigured().campaigns.start(uniqueId));
  }

  pauseCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.ensureConfigured().campaigns.pause(uniqueId));
  }

  stopCampaign(uniqueId: string): Observable<Campaign> {
    return from(this.ensureConfigured().campaigns.stop(uniqueId));
  }

  getCampaignResults(uniqueId: string): Observable<CampaignResults> {
    return from(this.ensureConfigured().campaigns.getResults(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Campaign Media Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMedia(params?: ListCampaignMediaParams): Observable<PageResult<CampaignMedia>> {
    return from(this.ensureConfigured().media.list(params));
  }

  getMedia(uniqueId: string): Observable<CampaignMedia> {
    return from(this.ensureConfigured().media.get(uniqueId));
  }

  createMedia(data: CreateCampaignMediaRequest): Observable<CampaignMedia> {
    return from(this.ensureConfigured().media.create(data));
  }

  updateMedia(uniqueId: string, data: UpdateCampaignMediaRequest): Observable<CampaignMedia> {
    return from(this.ensureConfigured().media.update(uniqueId, data));
  }

  deleteMedia(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().media.delete(uniqueId));
  }

  listMediaByCampaign(campaignUniqueId: string): Observable<CampaignMedia[]> {
    return from(this.ensureConfigured().media.listByCampaign(campaignUniqueId));
  }

  getMediaResults(uniqueId: string): Observable<CampaignMediaResults> {
    return from(this.ensureConfigured().media.getResults(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Landing Pages Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLandingPages(params?: ListLandingPagesParams): Observable<PageResult<LandingPage>> {
    return from(this.ensureConfigured().landingPages.list(params));
  }

  getLandingPage(uniqueId: string): Observable<LandingPage> {
    return from(this.ensureConfigured().landingPages.get(uniqueId));
  }

  createLandingPage(data: CreateLandingPageRequest): Observable<LandingPage> {
    return from(this.ensureConfigured().landingPages.create(data));
  }

  updateLandingPage(uniqueId: string, data: UpdateLandingPageRequest): Observable<LandingPage> {
    return from(this.ensureConfigured().landingPages.update(uniqueId, data));
  }

  deleteLandingPage(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().landingPages.delete(uniqueId));
  }

  publishLandingPage(uniqueId: string): Observable<LandingPage> {
    return from(this.ensureConfigured().landingPages.publish(uniqueId));
  }

  unpublishLandingPage(uniqueId: string): Observable<LandingPage> {
    return from(this.ensureConfigured().landingPages.unpublish(uniqueId));
  }

  getLandingPageBySlug(slug: string): Observable<LandingPage> {
    return from(this.ensureConfigured().landingPages.getBySlug(slug));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Audiences Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAudiences(params?: ListAudiencesParams): Observable<PageResult<Audience>> {
    return from(this.ensureConfigured().audiences.list(params));
  }

  getAudience(uniqueId: string): Observable<Audience> {
    return from(this.ensureConfigured().audiences.get(uniqueId));
  }

  createAudience(data: CreateAudienceRequest): Observable<Audience> {
    return from(this.ensureConfigured().audiences.create(data));
  }

  updateAudience(uniqueId: string, data: UpdateAudienceRequest): Observable<Audience> {
    return from(this.ensureConfigured().audiences.update(uniqueId, data));
  }

  deleteAudience(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().audiences.delete(uniqueId));
  }

  getAudienceMembers(uniqueId: string): Observable<AudienceMember[]> {
    return from(this.ensureConfigured().audiences.getMembers(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): CampaignsBlock {
    return this.ensureConfigured();
  }
}
