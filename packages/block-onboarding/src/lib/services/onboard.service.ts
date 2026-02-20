import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  OnboardJourney,
  OnboardJourneyDetails,
  StartOnboardRequest,
  StepOnboardRequest,
  LogOnboardRequest,
} from '../types/onboard.js';
import { onboardJourneyMapper } from '../mappers/onboard.mapper.js';

export interface OnboardService {
  /**
   * Start a new onboard journey for a user.
   * @returns The newly created OnboardJourney record.
   */
  start(uniqueId: string, data?: StartOnboardRequest): Promise<OnboardJourney>;

  /**
   * Get a single onboard journey by unique ID.
   * @returns The matching OnboardJourney record.
   */
  get(uniqueId: string): Promise<OnboardJourney>;

  /**
   * Get detailed information about an onboard journey including step progress and logs.
   * @returns OnboardJourneyDetails with steps and log entries.
   */
  getDetails(uniqueId: string): Promise<OnboardJourneyDetails>;

  /**
   * Advance the onboard journey to a specific step.
   * @returns The updated OnboardJourney record.
   */
  step(uniqueId: string, data: StepOnboardRequest): Promise<OnboardJourney>;

  /**
   * Log an action or event for the onboard journey.
   * @returns The updated OnboardJourney record.
   */
  log(uniqueId: string, data: LogOnboardRequest): Promise<OnboardJourney>;

  /**
   * Suspend an active onboard journey.
   * @returns The updated OnboardJourney record with suspended status.
   */
  suspend(uniqueId: string): Promise<OnboardJourney>;

  /**
   * Resume a suspended onboard journey.
   * @returns The updated OnboardJourney record with resumed status.
   */
  resume(uniqueId: string): Promise<OnboardJourney>;
}

export function createOnboardService(transport: Transport, _config: { apiKey: string }): OnboardService {
  return {
    async start(uniqueId: string, data?: StartOnboardRequest): Promise<OnboardJourney> {
      const response = await transport.post<unknown>(`/onboard/${uniqueId}/start`, {
        onboard: {
          onboarding_unique_id: data?.onboardingUniqueId,
          payload: data?.payload,
        },
      });
      return decodeOne(response, onboardJourneyMapper);
    },

    async get(uniqueId: string): Promise<OnboardJourney> {
      const response = await transport.get<unknown>(`/onboard/${uniqueId}`);
      return decodeOne(response, onboardJourneyMapper);
    },

    async getDetails(uniqueId: string): Promise<OnboardJourneyDetails> {
      const response = await transport.get<any>(`/onboard/${uniqueId}/details`);
      const base = decodeOne(response, onboardJourneyMapper);
      return {
        ...base,
        onboardingName: response.data?.attributes?.onboarding_name,
        steps: (response.data?.attributes?.steps || []).map((s: any) => ({
          stepNumber: s.step_number,
          stepName: s.step_name,
          completed: s.completed,
          completedAt: s.completed_at ? new Date(s.completed_at) : undefined,
          data: s.data,
        })),
        logs: (response.data?.attributes?.logs || []).map((l: any) => ({
          uniqueId: l.unique_id,
          action: l.action,
          stepNumber: l.step_number,
          message: l.message,
          payload: l.payload,
          createdAt: new Date(l.created_at),
        })),
      };
    },

    async step(uniqueId: string, data: StepOnboardRequest): Promise<OnboardJourney> {
      const response = await transport.put<unknown>(`/onboard/${uniqueId}`, {
        step: {
          step_number: data.stepNumber,
          step_data: data.stepData,
        },
      });
      return decodeOne(response, onboardJourneyMapper);
    },

    async log(uniqueId: string, data: LogOnboardRequest): Promise<OnboardJourney> {
      const response = await transport.put<unknown>(`/onboard/${uniqueId}/log`, {
        log: {
          action: data.action,
          step_number: data.stepNumber,
          message: data.message,
          payload: data.payload,
        },
      });
      return decodeOne(response, onboardJourneyMapper);
    },

    async suspend(uniqueId: string): Promise<OnboardJourney> {
      const response = await transport.put<unknown>(`/onboard/${uniqueId}/suspend`, {});
      return decodeOne(response, onboardJourneyMapper);
    },

    async resume(uniqueId: string): Promise<OnboardJourney> {
      const response = await transport.put<unknown>(`/onboard/${uniqueId}/resume`, {});
      return decodeOne(response, onboardJourneyMapper);
    },
  };
}
