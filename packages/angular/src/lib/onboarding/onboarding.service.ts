import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createOnboardingBlock,
  type OnboardingBlock,
  type OnboardingBlockConfig,
  type Onboarding,
  type CreateOnboardingRequest,
  type UpdateOnboardingRequest,
  type ListOnboardingsParams,
  type Flow,
  type CreateFlowRequest,
  type UpdateFlowRequest,
  type ListFlowsParams,
  type UserJourney,
  type StartJourneyRequest,
  type CompleteStepRequest,
  type ListUserJourneysParams,
  type UserIdentity,
  type CreateUserIdentityRequest,
  type VerifyUserIdentityRequest,
  type ListUserIdentitiesParams,
} from '@23blocks/block-onboarding';
import { TRANSPORT, ONBOARDING_TRANSPORT, ONBOARDING_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Onboarding block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class OnboardingComponent {
 *   constructor(private onboarding: OnboardingService) {}
 *
 *   createOnboarding() {
 *     this.onboarding.createOnboarding({
 *       code: 'user-onboarding',
 *       name: 'User Onboarding',
 *       steps: []
 *     }).subscribe({
 *       next: (onboarding) => console.log('Created:', onboarding),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly block: OnboardingBlock | null;

  constructor(
    @Optional() @Inject(ONBOARDING_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(ONBOARDING_CONFIG) config: OnboardingBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createOnboardingBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): OnboardingBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] OnboardingService is not configured. ' +
        "Add 'urls.onboarding' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Onboardings Service
  // ─────────────────────────────────────────────────────────────────────────────

  listOnboardings(params?: ListOnboardingsParams): Observable<PageResult<Onboarding>> {
    return from(this.ensureConfigured().onboardings.list(params));
  }

  getOnboarding(uniqueId: string): Observable<Onboarding> {
    return from(this.ensureConfigured().onboardings.get(uniqueId));
  }

  createOnboarding(request: CreateOnboardingRequest): Observable<Onboarding> {
    return from(this.ensureConfigured().onboardings.create(request));
  }

  updateOnboarding(uniqueId: string, request: UpdateOnboardingRequest): Observable<Onboarding> {
    return from(this.ensureConfigured().onboardings.update(uniqueId, request));
  }

  deleteOnboarding(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().onboardings.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Flows Service
  // ─────────────────────────────────────────────────────────────────────────────

  listFlows(params?: ListFlowsParams): Observable<PageResult<Flow>> {
    return from(this.ensureConfigured().flows.list(params));
  }

  getFlow(uniqueId: string): Observable<Flow> {
    return from(this.ensureConfigured().flows.get(uniqueId));
  }

  createFlow(request: CreateFlowRequest): Observable<Flow> {
    return from(this.ensureConfigured().flows.create(request));
  }

  updateFlow(uniqueId: string, request: UpdateFlowRequest): Observable<Flow> {
    return from(this.ensureConfigured().flows.update(uniqueId, request));
  }

  deleteFlow(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().flows.delete(uniqueId));
  }

  listFlowsByOnboarding(onboardingUniqueId: string): Observable<Flow[]> {
    return from(this.ensureConfigured().flows.listByOnboarding(onboardingUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Journeys Service
  // ─────────────────────────────────────────────────────────────────────────────

  listUserJourneys(params?: ListUserJourneysParams): Observable<PageResult<UserJourney>> {
    return from(this.ensureConfigured().userJourneys.list(params));
  }

  getUserJourney(uniqueId: string): Observable<UserJourney> {
    return from(this.ensureConfigured().userJourneys.get(uniqueId));
  }

  startJourney(request: StartJourneyRequest): Observable<UserJourney> {
    return from(this.ensureConfigured().userJourneys.start(request));
  }

  completeStep(uniqueId: string, request: CompleteStepRequest): Observable<UserJourney> {
    return from(this.ensureConfigured().userJourneys.completeStep(uniqueId, request));
  }

  abandonJourney(uniqueId: string): Observable<UserJourney> {
    return from(this.ensureConfigured().userJourneys.abandon(uniqueId));
  }

  getJourneysByUser(userUniqueId: string): Observable<UserJourney[]> {
    return from(this.ensureConfigured().userJourneys.getByUser(userUniqueId));
  }

  getJourneyProgress(uniqueId: string): Observable<{ progress: number; currentStep?: number; completedSteps?: number[] }> {
    return from(this.ensureConfigured().userJourneys.getProgress(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Identities Service
  // ─────────────────────────────────────────────────────────────────────────────

  listUserIdentities(params?: ListUserIdentitiesParams): Observable<PageResult<UserIdentity>> {
    return from(this.ensureConfigured().userIdentities.list(params));
  }

  getUserIdentity(uniqueId: string): Observable<UserIdentity> {
    return from(this.ensureConfigured().userIdentities.get(uniqueId));
  }

  createUserIdentity(request: CreateUserIdentityRequest): Observable<UserIdentity> {
    return from(this.ensureConfigured().userIdentities.create(request));
  }

  verifyUserIdentity(uniqueId: string, request: VerifyUserIdentityRequest): Observable<UserIdentity> {
    return from(this.ensureConfigured().userIdentities.verify(uniqueId, request));
  }

  deleteUserIdentity(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().userIdentities.delete(uniqueId));
  }

  listIdentitiesByUser(userUniqueId: string): Observable<UserIdentity[]> {
    return from(this.ensureConfigured().userIdentities.listByUser(userUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): OnboardingBlock {
    return this.ensureConfigured();
  }
}
