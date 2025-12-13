import { Injectable, Inject } from '@angular/core';
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
import { TRANSPORT, ONBOARDING_CONFIG } from '../tokens.js';

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
  private readonly block: OnboardingBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(ONBOARDING_CONFIG) config: OnboardingBlockConfig
  ) {
    this.block = createOnboardingBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Onboardings Service
  // ─────────────────────────────────────────────────────────────────────────────

  listOnboardings(params?: ListOnboardingsParams): Observable<PageResult<Onboarding>> {
    return from(this.block.onboardings.list(params));
  }

  getOnboarding(uniqueId: string): Observable<Onboarding> {
    return from(this.block.onboardings.get(uniqueId));
  }

  createOnboarding(request: CreateOnboardingRequest): Observable<Onboarding> {
    return from(this.block.onboardings.create(request));
  }

  updateOnboarding(uniqueId: string, request: UpdateOnboardingRequest): Observable<Onboarding> {
    return from(this.block.onboardings.update(uniqueId, request));
  }

  deleteOnboarding(uniqueId: string): Observable<void> {
    return from(this.block.onboardings.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Flows Service
  // ─────────────────────────────────────────────────────────────────────────────

  listFlows(params?: ListFlowsParams): Observable<PageResult<Flow>> {
    return from(this.block.flows.list(params));
  }

  getFlow(uniqueId: string): Observable<Flow> {
    return from(this.block.flows.get(uniqueId));
  }

  createFlow(request: CreateFlowRequest): Observable<Flow> {
    return from(this.block.flows.create(request));
  }

  updateFlow(uniqueId: string, request: UpdateFlowRequest): Observable<Flow> {
    return from(this.block.flows.update(uniqueId, request));
  }

  deleteFlow(uniqueId: string): Observable<void> {
    return from(this.block.flows.delete(uniqueId));
  }

  listFlowsByOnboarding(onboardingUniqueId: string): Observable<Flow[]> {
    return from(this.block.flows.listByOnboarding(onboardingUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Journeys Service
  // ─────────────────────────────────────────────────────────────────────────────

  listUserJourneys(params?: ListUserJourneysParams): Observable<PageResult<UserJourney>> {
    return from(this.block.userJourneys.list(params));
  }

  getUserJourney(uniqueId: string): Observable<UserJourney> {
    return from(this.block.userJourneys.get(uniqueId));
  }

  startJourney(request: StartJourneyRequest): Observable<UserJourney> {
    return from(this.block.userJourneys.start(request));
  }

  completeStep(uniqueId: string, request: CompleteStepRequest): Observable<UserJourney> {
    return from(this.block.userJourneys.completeStep(uniqueId, request));
  }

  abandonJourney(uniqueId: string): Observable<UserJourney> {
    return from(this.block.userJourneys.abandon(uniqueId));
  }

  getJourneysByUser(userUniqueId: string): Observable<UserJourney[]> {
    return from(this.block.userJourneys.getByUser(userUniqueId));
  }

  getJourneyProgress(uniqueId: string): Observable<{ progress: number; currentStep?: number; completedSteps?: number[] }> {
    return from(this.block.userJourneys.getProgress(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Identities Service
  // ─────────────────────────────────────────────────────────────────────────────

  listUserIdentities(params?: ListUserIdentitiesParams): Observable<PageResult<UserIdentity>> {
    return from(this.block.userIdentities.list(params));
  }

  getUserIdentity(uniqueId: string): Observable<UserIdentity> {
    return from(this.block.userIdentities.get(uniqueId));
  }

  createUserIdentity(request: CreateUserIdentityRequest): Observable<UserIdentity> {
    return from(this.block.userIdentities.create(request));
  }

  verifyUserIdentity(uniqueId: string, request: VerifyUserIdentityRequest): Observable<UserIdentity> {
    return from(this.block.userIdentities.verify(uniqueId, request));
  }

  deleteUserIdentity(uniqueId: string): Observable<void> {
    return from(this.block.userIdentities.delete(uniqueId));
  }

  listIdentitiesByUser(userUniqueId: string): Observable<UserIdentity[]> {
    return from(this.block.userIdentities.listByUser(userUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): OnboardingBlock {
    return this.block;
  }
}
