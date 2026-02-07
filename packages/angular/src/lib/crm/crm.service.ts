import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createCrmBlock,
  type CrmBlock,
  type CrmBlockConfig,
} from '@23blocks/block-crm';
import { TRANSPORT, CRM_TRANSPORT, CRM_CONFIG } from '../tokens';

/**
 * Angular service wrapping the CRM block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const accounts = await this.crmService.accounts.list({ page: 1, perPage: 20 });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CrmService {
  private readonly block: CrmBlock | null;

  constructor(
    @Optional() @Inject(CRM_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CRM_CONFIG) config: CrmBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createCrmBlock(transport, config) : null;
  }

  private ensureConfigured(): CrmBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] CrmService is not configured. ' +
        "Add 'urls.crm' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get accounts() { return this.ensureConfigured().accounts; }
  get contacts() { return this.ensureConfigured().contacts; }
  get contactEvents() { return this.ensureConfigured().contactEvents; }
  get leads() { return this.ensureConfigured().leads; }
  get leadFollows() { return this.ensureConfigured().leadFollows; }
  get opportunities() { return this.ensureConfigured().opportunities; }
  get meetings() { return this.ensureConfigured().meetings; }
  get meetingParticipants() { return this.ensureConfigured().meetingParticipants; }
  get meetingBillings() { return this.ensureConfigured().meetingBillings; }
  get quotes() { return this.ensureConfigured().quotes; }
  get subscribers() { return this.ensureConfigured().subscribers; }
  get referrals() { return this.ensureConfigured().referrals; }
  get touches() { return this.ensureConfigured().touches; }
  get categories() { return this.ensureConfigured().categories; }
  get calendarAccounts() { return this.ensureConfigured().calendarAccounts; }
  get busyBlocks() { return this.ensureConfigured().busyBlocks; }
  get icsTokens() { return this.ensureConfigured().icsTokens; }
  get zoomMeetings() { return this.ensureConfigured().zoomMeetings; }
  get zoomHosts() { return this.ensureConfigured().zoomHosts; }
  get mailTemplates() { return this.ensureConfigured().mailTemplates; }
  get communications() { return this.ensureConfigured().communications; }
  get users() { return this.ensureConfigured().users; }
  get billingReports() { return this.ensureConfigured().billingReports; }
  get calendarSync() { return this.ensureConfigured().calendarSync; }

  /** Full block access */
  get crmBlock(): CrmBlock { return this.ensureConfigured(); }
}
