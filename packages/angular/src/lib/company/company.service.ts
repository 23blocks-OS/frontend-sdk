import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createCompanyBlock,
  type CompanyBlock,
  type CompanyBlockConfig,
} from '@23blocks/block-company';
import { TRANSPORT, COMPANY_TRANSPORT, COMPANY_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Company block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const companies = await this.companyService.companies.list();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly block: CompanyBlock | null;

  constructor(
    @Optional() @Inject(COMPANY_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(COMPANY_CONFIG) config: CompanyBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createCompanyBlock(transport, config) : null;
  }

  private ensureConfigured(): CompanyBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] CompanyService is not configured. ' +
        "Add 'urls.company' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get companies() { return this.ensureConfigured().companies; }
  get departments() { return this.ensureConfigured().departments; }
  get teams() { return this.ensureConfigured().teams; }
  get teamMembers() { return this.ensureConfigured().teamMembers; }
  get quarters() { return this.ensureConfigured().quarters; }
  get positions() { return this.ensureConfigured().positions; }
  get employeeAssignments() { return this.ensureConfigured().employeeAssignments; }

  /** Full block access */
  get companyBlock(): CompanyBlock { return this.ensureConfigured(); }
}
