import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createUniversityBlock,
  type UniversityBlock,
  type UniversityBlockConfig,
} from '@23blocks/block-university';
import { TRANSPORT, UNIVERSITY_TRANSPORT, UNIVERSITY_CONFIG } from '../tokens';

/**
 * Angular service wrapping the University block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const courses = await this.universityService.courses.list({ page: 1, perPage: 10 });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UniversityService {
  private readonly block: UniversityBlock | null;

  constructor(
    @Optional() @Inject(UNIVERSITY_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(UNIVERSITY_CONFIG) config: UniversityBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createUniversityBlock(transport, config) : null;
  }

  private ensureConfigured(): UniversityBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] UniversityService is not configured. ' +
        "Add 'urls.university' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get courses() { return this.ensureConfigured().courses; }
  get lessons() { return this.ensureConfigured().lessons; }
  get enrollments() { return this.ensureConfigured().enrollments; }
  get assignments() { return this.ensureConfigured().assignments; }
  get submissions() { return this.ensureConfigured().submissions; }
  get subjects() { return this.ensureConfigured().subjects; }
  get teachers() { return this.ensureConfigured().teachers; }
  get students() { return this.ensureConfigured().students; }
  get courseGroups() { return this.ensureConfigured().courseGroups; }
  get coachingSessions() { return this.ensureConfigured().coachingSessions; }
  get tests() { return this.ensureConfigured().tests; }
  get registrationTokens() { return this.ensureConfigured().registrationTokens; }
  get placements() { return this.ensureConfigured().placements; }
  get calendars() { return this.ensureConfigured().calendars; }
  get matches() { return this.ensureConfigured().matches; }
  get attendance() { return this.ensureConfigured().attendance; }
  get notes() { return this.ensureConfigured().notes; }

  /** Full block access */
  get universityBlock(): UniversityBlock { return this.ensureConfigured(); }
}
