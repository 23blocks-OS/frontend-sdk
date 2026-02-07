import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createContentBlock,
  type ContentBlock,
  type ContentBlockConfig,
} from '@23blocks/block-content';
import { TRANSPORT, CONTENT_TRANSPORT, CONTENT_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Content block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const posts = await this.contentService.posts.list({ page: 1, perPage: 10 });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly block: ContentBlock | null;

  constructor(
    @Optional() @Inject(CONTENT_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CONTENT_CONFIG) config: ContentBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createContentBlock(transport, config) : null;
  }

  private ensureConfigured(): ContentBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] ContentService is not configured. ' +
        "Add 'urls.content' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get posts() { return this.ensureConfigured().posts; }
  get postVersions() { return this.ensureConfigured().postVersions; }
  get postTemplates() { return this.ensureConfigured().postTemplates; }
  get comments() { return this.ensureConfigured().comments; }
  get categories() { return this.ensureConfigured().categories; }
  get tags() { return this.ensureConfigured().tags; }
  get users() { return this.ensureConfigured().users; }
  get moderation() { return this.ensureConfigured().moderation; }
  get activity() { return this.ensureConfigured().activity; }
  get series() { return this.ensureConfigured().series; }

  /** Full block access */
  get contentBlock(): ContentBlock { return this.ensureConfigured(); }
}
