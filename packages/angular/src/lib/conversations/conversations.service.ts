import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createConversationsBlock,
  type ConversationsBlock,
  type ConversationsBlockConfig,
} from '@23blocks/block-conversations';
import { TRANSPORT, CONVERSATIONS_TRANSPORT, CONVERSATIONS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Conversations block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const message = await this.conversationsService.messages.create({ contextId, content });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ConversationsService {
  private readonly block: ConversationsBlock | null;

  constructor(
    @Optional() @Inject(CONVERSATIONS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CONVERSATIONS_CONFIG) config: ConversationsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createConversationsBlock(transport, config) : null;
  }

  private ensureConfigured(): ConversationsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] ConversationsService is not configured. ' +
        "Add 'urls.conversations' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get messages() { return this.ensureConfigured().messages; }
  get draftMessages() { return this.ensureConfigured().draftMessages; }
  get groups() { return this.ensureConfigured().groups; }
  get groupInvites() { return this.ensureConfigured().groupInvites; }
  get notifications() { return this.ensureConfigured().notifications; }
  get conversations() { return this.ensureConfigured().conversations; }
  get websocketTokens() { return this.ensureConfigured().websocketTokens; }
  get contexts() { return this.ensureConfigured().contexts; }
  get notificationSettings() { return this.ensureConfigured().notificationSettings; }
  get availabilities() { return this.ensureConfigured().availabilities; }
  get messageFiles() { return this.ensureConfigured().messageFiles; }
  get sources() { return this.ensureConfigured().sources; }
  get users() { return this.ensureConfigured().users; }
  get meetings() { return this.ensureConfigured().meetings; }
  get webNotifications() { return this.ensureConfigured().webNotifications; }

  /** Full block access */
  get conversationsBlock(): ConversationsBlock { return this.ensureConfigured(); }
}
